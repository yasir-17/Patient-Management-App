"use server";

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { use } from "react";
import { InputFile } from 'node-appwrite/file'

export const createUser = async (user: CreateUserParams) => {
    try {
      console.log("Creating user with data:", user);
      const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
      console.log("New user created:", newUser);
      return parseStringify(newUser);
    } catch (error: any) {
      console.error("Error in createUser:", error);
      if (error && error?.code === 409) {
        console.log("User already exists, fetching existing user");
        const documents = await users.list([
          Query.equal('email', [user.email])
        ]);
        return documents?.users[0];
      }
      throw error; // Re-throw the error if it's not a 409
    }
  };

export const getUser = async(userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user)
  } catch (error) {
    console.log(error)
  }
}

export const registerPatient = async({ identificationDocument, ...patient } : RegisterUserParams) => {

  try {
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer (
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,
      )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id ? file.$id : null,
          identificationDocumentUrl: file?.$id
            ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
            : null,
          ...patient,
        }
      );
      console.log(`NEw patient register ${parseStringify(newPatient)} successfully`);
      return parseStringify(newPatient);
  } catch (error) {
    console.log(error)
  }
}