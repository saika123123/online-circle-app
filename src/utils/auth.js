import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.name);
    // TokenExpiredError の場合は特定のエラー処理をすることも可能
    return null;
  }
}

// クライアント側でトークンの有効性を確認するためのユーティリティ
export function isValidToken(token) {
  if (!token) return false;
  
  try {
    // JWTの期限をチェック（署名は確認せず、構造とペイロードのみ確認）
    const decoded = jwt.decode(token);
    if (!decoded) return false;
    
    // expがあれば確認（現在時刻と比較）
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}