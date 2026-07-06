import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'get-legal-super-secret-key-12345';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, expiresIn: string = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, tenantId: string | null, role: string, isProfileComplete: boolean = true) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, tenantId, role, isProfileComplete, expiresAt }, '7d');
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function createImpersonationSession(targetUserId: string, targetTenantId: string | null, targetRole: string, originalAdminId: string) {
  const cookieStore = await cookies();
  
  // Save current session to admin_session
  const currentSession = cookieStore.get('session')?.value;
  if (currentSession) {
    cookieStore.set('admin_session', currentSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  const session = await encrypt({ 
    userId: targetUserId, 
    tenantId: targetTenantId, 
    role: targetRole, 
    isImpersonated: true,
    originalAdminId,
    expiresAt 
  }, '30m');
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function restoreAdminSession() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;
  
  if (adminSession) {
    const payload = await decrypt(adminSession);
    if (payload && payload.expiresAt) {
      cookieStore.set('session', adminSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(payload.expiresAt as string | number),
        sameSite: 'lax',
        path: '/',
      });
    }
    cookieStore.delete('admin_session');
  } else {
    cookieStore.delete('session');
  }
}
