import { PrismaClient, RoleName, Plan } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main(){
  const userRole=await prisma.role.upsert({where:{name:RoleName.USER},update:{},create:{name:RoleName.USER}});
  const adminRole=await prisma.role.upsert({where:{name:RoleName.ADMIN},update:{},create:{name:RoleName.ADMIN}});
  const hash=await bcrypt.hash('ChangeMe123!',12);
  const admin=await prisma.user.upsert({where:{email:'admin@echogpt.local'},update:{},create:{email:'admin@echogpt.local',passwordHash:hash,name:'EchoGPT Admin',roleId:adminRole.id}});
  await prisma.subscription.upsert({where:{id:'00000000-0000-0000-0000-000000000001'},update:{},create:{id:'00000000-0000-0000-0000-000000000001',userId:admin.id,plan:Plan.PREMIUM,requestLimit:10000}});
  console.log('Seeded roles and admin:',admin.email,userRole.id,adminRole.id);
}
main().finally(()=>prisma.$disconnect());
