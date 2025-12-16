import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { BrandingService } from '@/lib/branding/branding-service';
import { RBACService } from '@/lib/rbac/rbac-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Check if user has permission to update branding settings
    const hasPermission = await RBACService.hasPermission(userId, 'settings', 'branding', {
      tenantId,
    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { preset } = body;

    if (!preset) {
      return NextResponse.json({ error: 'Preset name is required' }, { status: 400 });
    }

    try {
      await BrandingService.applyBrandingPreset(tenantId, preset, userId);
      return NextResponse.json({ message: `Preset '${preset}' applied successfully` });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Error applying branding preset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const presets = BrandingService.getBrandingPresets();
    return NextResponse.json({ presets });
  } catch (error) {
    console.error('Error fetching branding presets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}