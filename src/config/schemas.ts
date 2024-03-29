import { z } from "zod";

/**
 * Schema for the Register form.
 * .../auth/register
 */
export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    user_number: z.string().optional(),
    password: z.string().min(8).max(64),
    native_language: z.string().refine( value => value != '', { message: 'Please choose a language!' } ),
    studying_languages: z.string().array().nonempty('Please choose at least one!'),
    email: z.string().email(),
});

/**
 * Schema for the Password Reset form.
 * .../auth/register
 */
export const resetSchema = z.object({
    password: z.string().min(8).max(64),
    password_confirm: z.string().min(8).max(64),
});

/**
 * Schema for the User Basic Info form.
 */
export const userBasicInfoSchema = z.object({
    username: z.optional(z.string().min(3).max(20)).nullable(),
    first_name: z.optional(z.string().min(3).max(20)).nullable(),
    last_name: z.optional(z.string().min(3).max(20)).nullable(),
    user_number: z.optional(z.string().min(3).max(20)).nullable(),
});

/**
 * Schema for languages settings form.
 */
export const languagesSettingsSchema = z.object({
    native_language: z.string().optional(),
    studying_languages: z.string().optional().array(),
});

export const storeUserVocabSchema = z.object({
    prompt: z.number().default(1),
    type: z.number().int().default(1),
    grade: z.number().int().default(1),
    vocabulary_id: z.number().int().array(),
    custom_translation: z.string().optional(),
    POS: z.string().optional(),
});

export const titleEditSchema = z.object({
    title: z.string(),
});

/**
 * Schema for the Login form.
 */
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(100),
});

/**
 * Schema for file upload.
 */
const fileSchema = z.custom(
    (value) => value instanceof File,
    { message: 'Please upload a file.' },
);

/**
 * Schema for row object in CSV file mapping.
 */
const rowSchema = z.object({
    index: z.number().int(),
    column: z.string(),
});

/**
 * Schema for CSV file mapping.
 */
const mappingSchema = z.array(rowSchema);

/**
 * Schema for the vocabulary settings form.
 */
export const vocabSettingsSchema = z.object({
    gradeVocabList: fileSchema.optional(),
    frequencyVocabList: fileSchema.optional(),
    sentencesList: fileSchema.optional(),
    columnHeaders: z.string().array(),
    vocabData: z.string(),
});
