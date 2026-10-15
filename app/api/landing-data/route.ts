import { NextRequest, NextResponse } from 'next/server';
import { getSiteData, updateSiteData, type SiteData } from '@/lib/data';

/**
 * GET /api/landing-data
 * Returns the full site data object
 */
export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching site data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/landing-data
 * Updates the site data and triggers cache revalidation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate that we have data
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Update the data file and revalidate cache
    await updateSiteData(body as SiteData);

    return NextResponse.json({ 
      success: true, 
      message: 'Site data updated successfully' 
    });
  } catch (error) {
    console.error('Error updating site data:', error);
    return NextResponse.json(
      { error: 'Failed to update site data' },
      { status: 500 }
    );
  }
}
