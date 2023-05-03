import { z } from "zod";

/**
 * Schema for the Register form.
 * .../auth/register
 */
export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    user_number: z.optional(z.string().min(3).max(20)),
    password: z.string().min(4).max(100),
    password_confirm: z.string().min(4).max(100),
    email: z.string().email(),
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
