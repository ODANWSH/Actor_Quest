# API Key Configuration

To use this application, you need to configure your API key by storing it in a separate file. Follow these steps:

1. **Create a file named `config.js`** in the root directory of the project.
2. **Add the following code to `config.js`**:

   ```javascript
   // config.js
   export const SECRET_API_KEY = "your_tmdb_api_key_here";
   ```

3. **Replace `your_tmdb_api_key_here`** with your personal API key.

Note: For security purposes, make sure to add config.js to your .gitignore file to avoid including your API key in version control.
