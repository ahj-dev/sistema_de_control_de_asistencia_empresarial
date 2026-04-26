// Este script se puede ejecutar con `npx ts-node prisma/seed.ts` para cargar los días festivos de Colombia para el año 2026 en la base de datos
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cargando días festivos Colombia 2026...');

  const festivos = [
    { nombre: 'Año Nuevo',              fecha: new Date('2026-01-01') },
    { nombre: 'Día de Reyes',           fecha: new Date('2026-01-12') },
    { nombre: 'Día de San José',        fecha: new Date('2026-03-23') },
    { nombre: 'Jueves Santo',           fecha: new Date('2026-04-02') },
    { nombre: 'Viernes Santo',          fecha: new Date('2026-04-03') },
    { nombre: 'Día del Trabajo',        fecha: new Date('2026-05-01') },
    { nombre: 'Día de la Ascensión',    fecha: new Date('2026-05-18') },
    { nombre: 'Corpus Christi',         fecha: new Date('2026-06-08') },
    { nombre: 'Sagrado Corazón',        fecha: new Date('2026-06-15') },
    { nombre: 'San Pedro y San Pablo',  fecha: new Date('2026-06-29') },
    { nombre: 'Día de la Independencia',fecha: new Date('2026-07-20') },
    { nombre: 'Batalla de Boyacá',      fecha: new Date('2026-08-07') },
    { nombre: 'Asunción de la Virgen',  fecha: new Date('2026-08-17') },
    { nombre: 'Día de la Raza',         fecha: new Date('2026-10-12') },
    { nombre: 'Todos los Santos',       fecha: new Date('2026-11-02') },
    { nombre: 'Independencia Cartagena',fecha: new Date('2026-11-16') },
    { nombre: 'Inmaculada Concepción',  fecha: new Date('2026-12-08') },
    { nombre: 'Navidad',                fecha: new Date('2026-12-25') },
  ];

  for (const festivo of festivos) {
    await prisma.diaFestivo.upsert({
      where: {
        fecha_paisRegion: {
          fecha: festivo.fecha,
          paisRegion: 'CO',
        },
      },
      create: {
        nombre:     festivo.nombre,
        fecha:      festivo.fecha,
        recurrente: false,
        paisRegion: 'CO',
      },
      update: {},
    });
  }

  console.log(`${festivos.length} festivos cargados`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());