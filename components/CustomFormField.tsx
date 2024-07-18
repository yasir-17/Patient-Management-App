'use client'
import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldType } from "./forms/PatientForm"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { GenderOptions } from "@/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "./ui/textarea"
import { FileUploader } from "./FileUploader"
import { Checkbox } from "./ui/checkbox"

interface CustomFormFieldProps {
  form: UseFormReturn<any>,
  fieldType: FormFieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: string,
  dateFormat?: string,
  ShowTimeSelect?: boolean,
  children?: React.ReactNode,
  options?: { value: string; label: string | React.ReactNode }[];
  renderOption?: (option: { value: string; label: string | React.ReactNode }) => React.ReactNode;
  accept?: string;
  multiple?: boolean;
  renderSkeleton?: (field:any) => React.ReactNode,
}

const RenderField = ({ field, props } : { field: any, props: CustomFormFieldProps }) => {
    const {fieldType, iconSrc, iconAlt, placeholder, ShowTimeSelect, dateFormat, renderSkeleton} = props;
    switch (props.fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image 
                            src = {iconSrc}
                            height= {24}
                            width = {24}
                            alt = {iconAlt || 'icon'}
                            className = 'ml-2'
                        />
                    )}
                    <FormControl>
                        <Input 
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                        
                    </FormControl>
                </div>
            )

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput 
                        defaultCountry = "US"
                        placeholder = {placeholder}
                        international
                        withCountryCallingCode
                        value = {field.value}
                        onChange = {field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )

        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400" style={{ height: '59%' }}>
                    <Image
                        src = "/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt = 'calender'
                        className="ml-2"
                    />
                    <FormControl>
                        <DatePicker 
                        onChange={(date) => field.onChange(date)}
                        value={field.value}
                        />
                    </FormControl>
                </div>
            )

        case FormFieldType.SKELETON :
            return (
                renderSkeleton ? renderSkeleton(field): null 
            )

        case FormFieldType.SELECT:
                return (
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                      
                      <SelectContent className="shad-select-content">
                        {props.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {props.renderOption ? props.renderOption(option) : option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                );
        
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled = {props.disabled}
                    />
                </FormControl>

            )
        
            case FormFieldType.FILE_UPLOAD:
                return (
                    <FormControl>
                    <FileUploader
                        files={field.value}
                        onChange={(files) => field.onChange(files)}
                        accept={props.accept}
                        multiple={props.multiple}
                    />
                    </FormControl>
                );

            case FormFieldType.CHECKBOX:
                    return (
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                          </label>
                        </div>
                      </FormControl>
                    );
        
        default:
            break;
    }
}

const CustomFormField: React.FC<CustomFormFieldProps> = (props: CustomFormFieldProps) => {
    const { form, fieldType, name, label } = props
    return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex-1">
                {fieldType != FormFieldType.CHECKBOX && label && (
                    <FormLabel>
                        {label}
                    </FormLabel>
                )}

                <RenderField field = {field} props = {props}/>

                <FormMessage className="shad-error" />  
            </FormItem>
        
          )}
        />
    )
}

export { CustomFormField };