/**
 * Script to initialize page metadata for all navigation pages
 * Run this once after deploying new pages or navigation structure changes
 * 
 * Usage: npx ts-node server/scripts/init-page-metadata.ts
 */

import { db } from '../db';
import { pageMetadata } from '../../shared/schema';

const PAGES = [
  // Landing & Auth
  {
    path: '/',
    title: 'Home',
    description: 'Saint Vision Group - Complete Lending & Investment Platform',
    category: 'company',
    requiresAuth: false,
    displayOrder: 1,
  },
  {
    path: '/login',
    title: 'Sign In',
    description: 'Login to your Saint Vision account',
    category: 'company',
    requiresAuth: false,
    displayOrder: 2,
  },
  {
    path: '/signup',
    title: 'Sign Up',
    description: 'Create a new Saint Vision account',
    category: 'company',
    requiresAuth: false,
    displayOrder: 3,
  },

  // Primary Services
  {
    path: '/apply',
    title: 'Business Loans',
    description: 'Quick business loan application - $50K to $5M+',
    category: 'lending',
    subcategory: 'business-loans',
    requiresAuth: false,
    displayOrder: 1,
  },
  {
    path: '/full-lending-application-1',
    title: 'Full Lending Application',
    description: 'Complete loan application with all details',
    category: 'lending',
    subcategory: 'business-loans',
    requiresAuth: false,
    displayOrder: 2,
  },
  {
    path: '/real-estate',
    title: 'Real Estate Solutions',
    description: 'Real estate financing, DSCR loans, fix & flip',
    category: 'real-estate',
    requiresAuth: false,
    displayOrder: 1,
  },
  {
    path: '/investments',
    title: 'Investment Opportunities',
    description: '9-12% fixed returns, lending funds, real estate portfolio',
    category: 'investments',
    requiresAuth: false,
    displayOrder: 1,
  },

  // Client Portal
  {
    path: '/client-hub',
    title: 'Client Hub',
    description: 'Manage your applications, documents, and pipeline',
    category: 'company',
    requiresAuth: true,
    requiresRole: 'client',
    displayOrder: 5,
  },

  // Tools & Resources
  {
    path: '/upload-documents',
    title: 'Document Upload',
    description: 'Upload required documents for your application',
    category: 'tools',
    subcategory: 'documents',
    requiresAuth: true,
    requiresRole: 'client',
    displayOrder: 1,
  },
  {
    path: '/file-hub',
    title: 'Secure File Hub',
    description: 'Store and manage documents securely',
    category: 'tools',
    subcategory: 'documents',
    requiresAuth: true,
    requiresRole: 'client',
    displayOrder: 2,
  },
  {
    path: '/set-appointment',
    title: 'Schedule Appointment',
    description: 'Book a consultation with our team',
    category: 'tools',
    subcategory: 'support',
    requiresAuth: false,
    displayOrder: 3,
  },

  // Company Pages
  {
    path: '/about',
    title: 'About Us',
    description: 'Learn about Saint Vision Group',
    category: 'company',
    requiresAuth: false,
    displayOrder: 10,
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch with our team',
    category: 'company',
    requiresAuth: false,
    displayOrder: 11,
  },

  // Admin Pages (protected)
  {
    path: '/dashboard',
    title: 'Admin Dashboard',
    description: 'Admin dashboard and controls',
    category: 'admin',
    requiresAuth: true,
    requiresRole: 'admin',
    displayOrder: 1,
  },
  {
    path: '/admin/saintbook',
    title: 'SaintBook',
    description: 'Advanced admin interface',
    category: 'admin',
    requiresAuth: true,
    requiresRole: 'admin',
    displayOrder: 2,
  },

  // Specialized Lending Products
  {
    path: '/lending',
    title: 'Lending Products',
    description: 'All lending products and solutions',
    category: 'lending',
    requiresAuth: false,
    displayOrder: 3,
  },
];

async function initializePageMetadata() {
  try {
    console.log('🚀 Initializing page metadata...');

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const page of PAGES) {
      try {
        // Check if page already exists
        const existing = await db
          .select()
          .from(pageMetadata)
          .where((t) => t.path === page.path)
          .limit(1);

        if (existing.length > 0) {
          // Update existing
          await db.update(pageMetadata)
            .set({
              ...page,
              updatedAt: new Date(),
            })
            .where((t) => t.path === page.path);
          
          updated++;
          console.log(`✏️  Updated: ${page.path}`);
        } else {
          // Create new
          await db.insert(pageMetadata).values({
            ...page,
            isActive: true,
          });
          
          created++;
          console.log(`✅ Created: ${page.path}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${page.path}:`, error);
        skipped++;
      }
    }

    console.log('\n✨ Page metadata initialization complete!');
    console.log(`📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${PAGES.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run initialization
initializePageMetadata();
