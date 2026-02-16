import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'development',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01'
});

async function migrateBlogsToAddLanguage() {
  console.log('🔄 Starting migration to add language field...');
  
  try {
    // Fetch all blog documents that don't have a language field
    const blogsWithoutLanguage = await client.fetch(
      `*[_type == "blog" && !defined(language)] {
        _id,
        _type,
        title
      }`
    );
    
    console.log(`📊 Found ${blogsWithoutLanguage.length} blogs without language field`);
    
    if (blogsWithoutLanguage.length === 0) {
      console.log('✅ All blogs already have language field!');
      return;
    }
    
    // Update each blog to add language: 'it' 
    const patches = blogsWithoutLanguage.map(blog => ({
      id: blog._id,
      patch: {
        set: {
          language: 'it'
        }
      }
    }));
    
    // Execute patches in batches
    const batchSize = 10;
    for (let i = 0; i < patches.length; i += batchSize) {
      const batch = patches.slice(i, i + batchSize);
      
      console.log(`📝 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(patches.length/batchSize)}`);
      
      const transaction = client.transaction();
      batch.forEach(({ id, patch }) => {
        transaction.patch(id, patch);
      });
      
      await transaction.commit();
    }
    
    console.log('✅ Migration completed successfully!');
    console.log(`🎯 Updated ${blogsWithoutLanguage.length} blogs with language: 'it'`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check for SANITY_API_TOKEN
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN environment variable');
  console.log('Please set it with: export SANITY_API_TOKEN="your-token-here"');
  process.exit(1);
}

migrateBlogsToAddLanguage();