import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock data - we'll implement database queries later
    const mockOrganizations = [
      {
        id: "personal-org-" + user.id,
        name: `${user.user_metadata?.full_name || user.email?.split("@")[0]}'s Org`,
        description: "Your personal workspace",
        slug: "personal-org",
        role: "owner",
        ownerId: user.id,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ organizations: mockOrganizations });
  } catch (error) {
    console.error("Error in organizations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 },
      );
    }

    // For now, return mock data - we'll implement database insertion later
    const newOrganization = {
      id: "org-" + Date.now(),
      name: name.trim(),
      description: description?.trim() || null,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now(),
      role: "owner",
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ organization: newOrganization });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
