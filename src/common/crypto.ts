import { createCipheriv,createDecipheriv,randomBytes } from 'crypto';
export class SecretCrypto {
  private key:Buffer; constructor(){const raw=process.env.ENCRYPTION_KEY||''; if(raw.length!==32) throw new Error('ENCRYPTION_KEY must be exactly 32 characters'); this.key=Buffer.from(raw);}
  encrypt(value:string){const iv=randomBytes(12); const c=createCipheriv('aes-256-gcm',this.key,iv); const encrypted=Buffer.concat([c.update(value,'utf8'),c.final()]); return [iv.toString('base64'),c.getAuthTag().toString('base64'),encrypted.toString('base64')].join('.');}
  decrypt(payload:string){const [iv,tag,data]=payload.split('.'); const d=createDecipheriv('aes-256-gcm',this.key,Buffer.from(iv,'base64')); d.setAuthTag(Buffer.from(tag,'base64')); return Buffer.concat([d.update(Buffer.from(data,'base64')),d.final()]).toString('utf8');}
}
