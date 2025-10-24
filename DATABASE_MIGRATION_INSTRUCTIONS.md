# Database Migration Instructions

## Add `extracted_text` Column to Content Table

To enable the AI to read and analyze your uploaded Word and PowerPoint documents, you need to add the `extracted_text` column to your `content` table in Supabase.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `add_extracted_text_column.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Verify the Migration**
   - Go to "Table Editor" in the left sidebar
   - Select the `content` table
   - Check that the new `extracted_text` column is present

### What This Does:

- Adds a new `extracted_text` TEXT column to store extracted document content
- Creates a full-text search index for efficient text searching (optional, but recommended)
- Updates the column comment to reflect the new file types supported

### After Migration:

Once the migration is complete:
1. Restart your development server
2. Upload a new Word or PowerPoint document
3. The text will be automatically extracted and stored
4. The AI assistant will be able to read and analyze the content

### Troubleshooting:

If you encounter any errors:
- Make sure you're connected to the correct Supabase project
- Check that you have the necessary permissions to alter tables
- Contact support if you see permission errors
