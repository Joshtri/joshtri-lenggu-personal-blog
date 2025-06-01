"use client";

import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  Path,
  FieldPath,
} from "react-hook-form";
import { InputHTMLAttributes, ReactNode, useState, forwardRef } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { DayPicker } from "react-day-picker";
import { formatRupiah } from "@/utils/common";

import "react-day-picker/dist/style.css";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

type InputType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "textarea"
  | "checkbox"
  | "select"
  | "multiselect"
  | "date"
  | "birthdate"
  | "currency";

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelect = ({
  id,
  value = [],
  onChange,
  options,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
          disabled={disabled}
          type="button"
        >
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
                >
                  {label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      const option = options.find((opt) => opt.label === label);
                      if (option) removeOption(option.value, e);
                    }}
                  />
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                value.includes(option.value) && "bg-gray-100 dark:bg-gray-800"
              )}
              onClick={() => toggleOption(option.value)}
            >
              <Checkbox
                checked={value.includes(option.value)}
                className="mr-2"
                id={`${id}-${option.value}`}
              />
              <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface FormFieldProps<T extends FieldValues = FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: InputType;
  required?: boolean;
  rows?: number;
  options?: SelectOption[];
  register?: UseFormRegister<T>;
  control?: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormField = forwardRef<HTMLInputElement, FormFieldProps<any>>(
  <T extends FieldValues>(
    {
      name,
      label,
      type = "text",
      placeholder,
      required = false,
      rows = 3,
      options = [],
      register,
      control,
      rules,
      error,
      helperText,
      className,
      disabled = false,
      min,
      max,
      step,
      children,
      ...props
    }: FormFieldProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const renderField = () => {
      if (!control && register) {
        const registered = register(name, rules);

        switch (type) {
          case "textarea":
            return (
              <Textarea
                id={name}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={className}
                rows={rows}
                {...registered}
              />
            );

          case "checkbox":
            return (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={name}
                  disabled={disabled}
                  className={className}
                  {...registered}
                />
                <Label
                  htmlFor={name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {placeholder}
                </Label>
              </div>
            );

          default:
            return (
              <Input
                type={type}
                id={name}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={className}
                {...registered}
                min={min}
                max={max}
                step={step}
                {...props}
                ref={ref}
              />
            );
        }
      }

      if (!control) return null;

      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => {
            switch (type) {
              case "currency":
                return (
                  <Input
                    type="text"
                    id={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={className}
                    value={formatRupiah(String(field.value ?? ""))}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, "");
                      const num = parseInt(raw) || 0;
                      field.onChange(num);
                    }}
                  />
                );

              case "textarea":
                return (
                  <Textarea
                    id={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={className}
                    rows={rows}
                    {...field}
                    value={field.value ?? ""}
                  />
                );

              case "checkbox":
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                      className={className}
                    />
                    <Label
                      htmlFor={name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {placeholder}
                    </Label>
                  </div>
                );

              case "select":
                return (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger className={className}>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );

              case "multiselect":
                return (
                  <MultiSelect
                    id={name}
                    value={field.value || []}
                    onChange={field.onChange}
                    options={options}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                );

              case "birthdate":
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className={cn(
                          "w-full justify-start text-left rounded-md border px-3 py-2 text-sm shadow-sm",
                          !field.value && "text-muted-foreground",
                          className
                        )}
                        disabled={disabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {field.value
                            ? format(new Date(field.value), "dd MMMM yyyy", {
                                locale: id,
                              })
                            : placeholder || "Pilih tanggal lahir"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border rounded-md shadow-md bg-white dark:bg-zinc-900"
                      side="bottom"
                      align="start"
                    >
                      <div className="flex">
                        <div className="border-r p-2 max-h-[300px] overflow-y-auto">
                          <h3 className="font-medium text-sm mb-2 px-2">
                            Tahun
                          </h3>
                          {years.map((year) => (
                            <div
                              key={year}
                              className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                                field.value &&
                                new Date(field.value).getFullYear() === year
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : ""
                              }`}
                              onClick={() => {
                                const currentDate = field.value
                                  ? new Date(field.value)
                                  : new Date();
                                const newDate = new Date(
                                  currentDate.setFullYear(year)
                                );
                                field.onChange(newDate.toISOString());
                              }}
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                        <DayPicker
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          locale={id}
                          captionLayout="dropdown"
                          fromYear={currentYear - 100}
                          toYear={currentYear}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                );

              case "date":
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          className
                        )}
                        disabled={disabled}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), "PPP", { locale: id })
                          : placeholder || "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        locale={id}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                );

              default:
                return (
                  <Input
                    type={type}
                    id={name}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={className}
                    {...field}
                    value={field.value ?? ""}
                    min={min}
                    max={max}
                    step={step}
                    {...props}
                    ref={ref}
                  />
                );
            }
          }}
        />
      );
    };

    return (
      <div className="space-y-2 mb-4">
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {renderField()}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {children}
        
      </div>
    );
  }
);
FormField.displayName = "FormField";
export default FormField;
