import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Matchday } from './matches/matchday.entity';
import { Match } from './matches/match.entity';
import { Repository } from 'typeorm';

const ZONA_A: { fecha: number; partidos: { local: string; visita: string }[] }[] = [
  { fecha: 1, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Estudiantes (RC)' },
    { local: 'All Boys',            visita: 'Mitre (SE)' },
    { local: 'Los Andes',           visita: 'Alte. Brown' },
    { local: 'Godoy Cruz',          visita: 'Cdad. de Bolívar' },
    { local: 'Dep. Morón',          visita: 'Def. de Belgrano' },
    { local: 'Colón',               visita: 'Dep. Madryn' },
    { local: 'San Miguel',          visita: 'Ctral. Norte' },
    { local: 'San Telmo',           visita: 'Ferro Carril Oeste' },
    { local: 'Acassuso',            visita: 'Chaco For Ever' },
  ]},
  { fecha: 2, partidos: [
    { local: 'Acassuso',            visita: 'Racing (Cba.)' },
    { local: 'Chaco For Ever',      visita: 'San Telmo' },
    { local: 'Ferro Carril Oeste',  visita: 'San Miguel' },
    { local: 'Ctral. Norte',        visita: 'Colón' },
    { local: 'Dep. Madryn',         visita: 'Dep. Morón' },
    { local: 'Def. de Belgrano',    visita: 'Godoy Cruz' },
    { local: 'Cdad. de Bolívar',    visita: 'Los Andes' },
    { local: 'Alte. Brown',         visita: 'All Boys' },
    { local: 'Mitre (SE)',           visita: 'Estudiantes (RC)' },
  ]},
  { fecha: 3, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Mitre (SE)' },
    { local: 'Estudiantes (RC)',    visita: 'Alte. Brown' },
    { local: 'All Boys',            visita: 'Cdad. de Bolívar' },
    { local: 'Los Andes',           visita: 'Def. de Belgrano' },
    { local: 'Godoy Cruz',          visita: 'Dep. Madryn' },
    { local: 'Dep. Morón',          visita: 'Ctral. Norte' },
    { local: 'Colón',               visita: 'Ferro Carril Oeste' },
    { local: 'San Miguel',          visita: 'Chaco For Ever' },
    { local: 'San Telmo',           visita: 'Acassuso' },
  ]},
  { fecha: 4, partidos: [
    { local: 'San Telmo',           visita: 'Racing (Cba.)' },
    { local: 'Acassuso',            visita: 'San Miguel' },
    { local: 'Chaco For Ever',      visita: 'Colón' },
    { local: 'Ferro Carril Oeste',  visita: 'Dep. Morón' },
    { local: 'Ctral. Norte',        visita: 'Godoy Cruz' },
    { local: 'Dep. Madryn',         visita: 'Los Andes' },
    { local: 'Def. de Belgrano',    visita: 'All Boys' },
    { local: 'Cdad. de Bolívar',    visita: 'Estudiantes (RC)' },
    { local: 'Alte. Brown',         visita: 'Mitre (SE)' },
  ]},
  { fecha: 5, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Alte. Brown' },
    { local: 'Mitre (SE)',           visita: 'Cdad. de Bolívar' },
    { local: 'Estudiantes (RC)',    visita: 'Def. de Belgrano' },
    { local: 'All Boys',            visita: 'Dep. Madryn' },
    { local: 'Los Andes',           visita: 'Ctral. Norte' },
    { local: 'Godoy Cruz',          visita: 'Ferro Carril Oeste' },
    { local: 'Dep. Morón',          visita: 'Chaco For Ever' },
    { local: 'Colón',               visita: 'Acassuso' },
    { local: 'San Miguel',          visita: 'San Telmo' },
  ]},
  { fecha: 6, partidos: [
    { local: 'San Miguel',          visita: 'Racing (Cba.)' },
    { local: 'San Telmo',           visita: 'Colón' },
    { local: 'Acassuso',            visita: 'Dep. Morón' },
    { local: 'Chaco For Ever',      visita: 'Godoy Cruz' },
    { local: 'Ferro Carril Oeste',  visita: 'Los Andes' },
    { local: 'Ctral. Norte',        visita: 'All Boys' },
    { local: 'Dep. Madryn',         visita: 'Estudiantes (RC)' },
    { local: 'Def. de Belgrano',    visita: 'Mitre (SE)' },
    { local: 'Cdad. de Bolívar',    visita: 'Alte. Brown' },
  ]},
  { fecha: 7, partidos: [
    { local: 'Def. de Belgrano',    visita: 'At. de Rafaela' },
  ]},
  { fecha: 8, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Cdad. de Bolívar' },
    { local: 'Alte. Brown',         visita: 'Def. de Belgrano' },
    { local: 'Mitre (SE)',           visita: 'Dep. Madryn' },
    { local: 'Estudiantes (RC)',    visita: 'Ctral. Norte' },
    { local: 'All Boys',            visita: 'Ferro Carril Oeste' },
    { local: 'Los Andes',           visita: 'Chaco For Ever' },
    { local: 'Godoy Cruz',          visita: 'Acassuso' },
    { local: 'Dep. Morón',          visita: 'San Telmo' },
    { local: 'Colón',               visita: 'San Miguel' },
  ]},
  { fecha: 9, partidos: [
    { local: 'Colón',               visita: 'Racing (Cba.)' },
    { local: 'San Miguel',          visita: 'Dep. Morón' },
    { local: 'San Telmo',           visita: 'Godoy Cruz' },
    { local: 'Acassuso',            visita: 'Los Andes' },
    { local: 'Chaco For Ever',      visita: 'All Boys' },
    { local: 'Ferro Carril Oeste',  visita: 'Estudiantes (RC)' },
    { local: 'Ctral. Norte',        visita: 'Mitre (SE)' },
    { local: 'Dep. Madryn',         visita: 'Alte. Brown' },
    { local: 'Def. de Belgrano',    visita: 'Cdad. de Bolívar' },
  ]},
  { fecha: 10, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Def. de Belgrano' },
    { local: 'Cdad. de Bolívar',    visita: 'Dep. Madryn' },
    { local: 'Alte. Brown',         visita: 'Ctral. Norte' },
    { local: 'Mitre (SE)',           visita: 'Ferro Carril Oeste' },
    { local: 'Estudiantes (RC)',    visita: 'Chaco For Ever' },
    { local: 'All Boys',            visita: 'Acassuso' },
    { local: 'Los Andes',           visita: 'San Telmo' },
    { local: 'Godoy Cruz',          visita: 'San Miguel' },
    { local: 'Dep. Morón',          visita: 'Colón' },
  ]},
  { fecha: 11, partidos: [
    { local: 'Dep. Morón',          visita: 'Racing (Cba.)' },
    { local: 'Colón',               visita: 'Godoy Cruz' },
    { local: 'San Miguel',          visita: 'Los Andes' },
    { local: 'San Telmo',           visita: 'All Boys' },
    { local: 'Acassuso',            visita: 'Estudiantes (RC)' },
    { local: 'Chaco For Ever',      visita: 'Mitre (SE)' },
    { local: 'Ferro Carril Oeste',  visita: 'Alte. Brown' },
    { local: 'Ctral. Norte',        visita: 'Cdad. de Bolívar' },
    { local: 'Dep. Madryn',         visita: 'Def. de Belgrano' },
  ]},
  { fecha: 12, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Dep. Madryn' },
    { local: 'Def. de Belgrano',    visita: 'Ctral. Norte' },
    { local: 'Cdad. de Bolívar',    visita: 'Ferro Carril Oeste' },
    { local: 'Alte. Brown',         visita: 'Chaco For Ever' },
    { local: 'Mitre (SE)',           visita: 'Acassuso' },
    { local: 'Estudiantes (RC)',    visita: 'San Telmo' },
    { local: 'All Boys',            visita: 'San Miguel' },
    { local: 'Los Andes',           visita: 'Colón' },
    { local: 'Godoy Cruz',          visita: 'Dep. Morón' },
  ]},
  { fecha: 13, partidos: [
    { local: 'Godoy Cruz',          visita: 'Racing (Cba.)' },
    { local: 'Dep. Morón',          visita: 'Los Andes' },
    { local: 'Colón',               visita: 'All Boys' },
    { local: 'San Miguel',          visita: 'Estudiantes (RC)' },
    { local: 'San Telmo',           visita: 'Mitre (SE)' },
    { local: 'Acassuso',            visita: 'Alte. Brown' },
    { local: 'Chaco For Ever',      visita: 'Cdad. de Bolívar' },
    { local: 'Ferro Carril Oeste',  visita: 'Def. de Belgrano' },
    { local: 'Ctral. Norte',        visita: 'Dep. Madryn' },
  ]},
  { fecha: 14, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Ctral. Norte' },
    { local: 'Dep. Madryn',         visita: 'Ferro Carril Oeste' },
    { local: 'Def. de Belgrano',    visita: 'Chaco For Ever' },
    { local: 'Cdad. de Bolívar',    visita: 'Acassuso' },
    { local: 'Alte. Brown',         visita: 'San Telmo' },
    { local: 'Mitre (SE)',           visita: 'San Miguel' },
    { local: 'Estudiantes (RC)',    visita: 'Colón' },
    { local: 'All Boys',            visita: 'Dep. Morón' },
    { local: 'Los Andes',           visita: 'Godoy Cruz' },
  ]},
  { fecha: 15, partidos: [
    { local: 'Los Andes',           visita: 'Racing (Cba.)' },
    { local: 'Godoy Cruz',          visita: 'All Boys' },
    { local: 'Dep. Morón',          visita: 'Estudiantes (RC)' },
    { local: 'Colón',               visita: 'Mitre (SE)' },
    { local: 'San Miguel',          visita: 'Alte. Brown' },
    { local: 'San Telmo',           visita: 'Cdad. de Bolívar' },
    { local: 'Acassuso',            visita: 'Def. de Belgrano' },
    { local: 'Chaco For Ever',      visita: 'Dep. Madryn' },
    { local: 'Ferro Carril Oeste',  visita: 'Ctral. Norte' },
  ]},
  { fecha: 16, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Ferro Carril Oeste' },
    { local: 'Ctral. Norte',        visita: 'Chaco For Ever' },
    { local: 'Dep. Madryn',         visita: 'Acassuso' },
    { local: 'Def. de Belgrano',    visita: 'San Telmo' },
    { local: 'Cdad. de Bolívar',    visita: 'San Miguel' },
    { local: 'Alte. Brown',         visita: 'Colón' },
    { local: 'Mitre (SE)',           visita: 'Dep. Morón' },
    { local: 'Estudiantes (RC)',    visita: 'Godoy Cruz' },
    { local: 'All Boys',            visita: 'Los Andes' },
  ]},
  { fecha: 17, partidos: [
    { local: 'All Boys',            visita: 'Racing (Cba.)' },
    { local: 'Los Andes',           visita: 'Estudiantes (RC)' },
    { local: 'Godoy Cruz',          visita: 'Mitre (SE)' },
    { local: 'Dep. Morón',          visita: 'Alte. Brown' },
    { local: 'Colón',               visita: 'Cdad. de Bolívar' },
    { local: 'San Miguel',          visita: 'Def. de Belgrano' },
    { local: 'San Telmo',           visita: 'Dep. Madryn' },
    { local: 'Acassuso',            visita: 'Ctral. Norte' },
    { local: 'Chaco For Ever',      visita: 'Ferro Carril Oeste' },
  ]},
  { fecha: 18, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Chaco For Ever' },
    { local: 'Ferro Carril Oeste',  visita: 'Acassuso' },
    { local: 'Ctral. Norte',        visita: 'San Telmo' },
    { local: 'Dep. Madryn',         visita: 'San Miguel' },
    { local: 'Def. de Belgrano',    visita: 'Colón' },
    { local: 'Cdad. de Bolívar',    visita: 'Dep. Morón' },
    { local: 'Alte. Brown',         visita: 'Godoy Cruz' },
    { local: 'Mitre (SE)',           visita: 'Los Andes' },
    { local: 'Estudiantes (RC)',    visita: 'All Boys' },
  ]},
  { fecha: 19, partidos: [
    { local: 'Estudiantes (RC)',    visita: 'Racing (Cba.)' },
    { local: 'Mitre (SE)',           visita: 'All Boys' },
    { local: 'Alte. Brown',         visita: 'Los Andes' },
    { local: 'Cdad. de Bolívar',    visita: 'Godoy Cruz' },
    { local: 'Def. de Belgrano',    visita: 'Dep. Morón' },
    { local: 'Dep. Madryn',         visita: 'Colón' },
    { local: 'Ctral. Norte',        visita: 'San Miguel' },
    { local: 'Ferro Carril Oeste',  visita: 'San Telmo' },
    { local: 'Chaco For Ever',      visita: 'Acassuso' },
  ]},
  { fecha: 20, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Acassuso' },
    { local: 'San Telmo',           visita: 'Chaco For Ever' },
    { local: 'San Miguel',          visita: 'Ferro Carril Oeste' },
    { local: 'Colón',               visita: 'Ctral. Norte' },
    { local: 'Dep. Morón',          visita: 'Dep. Madryn' },
    { local: 'Godoy Cruz',          visita: 'Def. de Belgrano' },
    { local: 'Los Andes',           visita: 'Cdad. de Bolívar' },
    { local: 'All Boys',            visita: 'Alte. Brown' },
    { local: 'Estudiantes (RC)',    visita: 'Mitre (SE)' },
  ]},
  { fecha: 21, partidos: [
    { local: 'Mitre (SE)',           visita: 'Racing (Cba.)' },
    { local: 'Alte. Brown',         visita: 'Estudiantes (RC)' },
    { local: 'Cdad. de Bolívar',    visita: 'All Boys' },
    { local: 'Def. de Belgrano',    visita: 'Los Andes' },
    { local: 'Dep. Madryn',         visita: 'Godoy Cruz' },
    { local: 'Ctral. Norte',        visita: 'Dep. Morón' },
    { local: 'Ferro Carril Oeste',  visita: 'Colón' },
    { local: 'Chaco For Ever',      visita: 'San Miguel' },
    { local: 'Acassuso',            visita: 'San Telmo' },
  ]},
  { fecha: 22, partidos: [
    { local: 'Racing (Cba.)',       visita: 'San Telmo' },
    { local: 'San Miguel',          visita: 'Acassuso' },
    { local: 'Colón',               visita: 'Chaco For Ever' },
    { local: 'Dep. Morón',          visita: 'Ferro Carril Oeste' },
    { local: 'Godoy Cruz',          visita: 'Ctral. Norte' },
    { local: 'Los Andes',           visita: 'Dep. Madryn' },
    { local: 'All Boys',            visita: 'Def. de Belgrano' },
    { local: 'Estudiantes (RC)',    visita: 'Cdad. de Bolívar' },
    { local: 'Mitre (SE)',           visita: 'Alte. Brown' },
  ]},
  { fecha: 23, partidos: [
    { local: 'Alte. Brown',         visita: 'Racing (Cba.)' },
    { local: 'Cdad. de Bolívar',    visita: 'Mitre (SE)' },
    { local: 'Def. de Belgrano',    visita: 'Estudiantes (RC)' },
    { local: 'Dep. Madryn',         visita: 'All Boys' },
    { local: 'Ctral. Norte',        visita: 'Los Andes' },
    { local: 'Ferro Carril Oeste',  visita: 'Godoy Cruz' },
    { local: 'Chaco For Ever',      visita: 'Dep. Morón' },
    { local: 'Acassuso',            visita: 'Colón' },
    { local: 'San Telmo',           visita: 'San Miguel' },
  ]},
  { fecha: 24, partidos: [
    { local: 'Racing (Cba.)',       visita: 'San Miguel' },
    { local: 'Colón',               visita: 'San Telmo' },
    { local: 'Dep. Morón',          visita: 'Acassuso' },
    { local: 'Godoy Cruz',          visita: 'Chaco For Ever' },
    { local: 'Los Andes',           visita: 'Ferro Carril Oeste' },
    { local: 'All Boys',            visita: 'Ctral. Norte' },
    { local: 'Estudiantes (RC)',    visita: 'Dep. Madryn' },
    { local: 'Mitre (SE)',           visita: 'Def. de Belgrano' },
    { local: 'Alte. Brown',         visita: 'Cdad. de Bolívar' },
  ]},
  { fecha: 25, partidos: [
    { local: 'At. de Rafaela',      visita: 'Def. de Belgrano' },
  ]},
  { fecha: 26, partidos: [
    { local: 'Cdad. de Bolívar',    visita: 'Racing (Cba.)' },
    { local: 'Def. de Belgrano',    visita: 'Alte. Brown' },
    { local: 'Dep. Madryn',         visita: 'Mitre (SE)' },
    { local: 'Ctral. Norte',        visita: 'Estudiantes (RC)' },
    { local: 'Ferro Carril Oeste',  visita: 'All Boys' },
    { local: 'Chaco For Ever',      visita: 'Los Andes' },
    { local: 'Acassuso',            visita: 'Godoy Cruz' },
    { local: 'San Telmo',           visita: 'Dep. Morón' },
    { local: 'San Miguel',          visita: 'Colón' },
  ]},
  { fecha: 27, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Colón' },
    { local: 'Dep. Morón',          visita: 'San Miguel' },
    { local: 'Godoy Cruz',          visita: 'San Telmo' },
    { local: 'Los Andes',           visita: 'Acassuso' },
    { local: 'All Boys',            visita: 'Chaco For Ever' },
    { local: 'Estudiantes (RC)',    visita: 'Ferro Carril Oeste' },
    { local: 'Mitre (SE)',           visita: 'Ctral. Norte' },
    { local: 'Alte. Brown',         visita: 'Dep. Madryn' },
    { local: 'Cdad. de Bolívar',    visita: 'Def. de Belgrano' },
  ]},
  { fecha: 28, partidos: [
    { local: 'Def. de Belgrano',    visita: 'Racing (Cba.)' },
    { local: 'Dep. Madryn',         visita: 'Cdad. de Bolívar' },
    { local: 'Ctral. Norte',        visita: 'Alte. Brown' },
    { local: 'Ferro Carril Oeste',  visita: 'Mitre (SE)' },
    { local: 'Chaco For Ever',      visita: 'Estudiantes (RC)' },
    { local: 'Acassuso',            visita: 'All Boys' },
    { local: 'San Telmo',           visita: 'Los Andes' },
    { local: 'San Miguel',          visita: 'Godoy Cruz' },
    { local: 'Colón',               visita: 'Dep. Morón' },
  ]},
  { fecha: 29, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Dep. Morón' },
    { local: 'Godoy Cruz',          visita: 'Colón' },
    { local: 'Los Andes',           visita: 'San Miguel' },
    { local: 'All Boys',            visita: 'San Telmo' },
    { local: 'Estudiantes (RC)',    visita: 'Acassuso' },
    { local: 'Mitre (SE)',           visita: 'Chaco For Ever' },
    { local: 'Alte. Brown',         visita: 'Ferro Carril Oeste' },
    { local: 'Cdad. de Bolívar',    visita: 'Ctral. Norte' },
    { local: 'Def. de Belgrano',    visita: 'Dep. Madryn' },
  ]},
  { fecha: 30, partidos: [
    { local: 'Dep. Madryn',         visita: 'Racing (Cba.)' },
    { local: 'Ctral. Norte',        visita: 'Def. de Belgrano' },
    { local: 'Ferro Carril Oeste',  visita: 'Cdad. de Bolívar' },
    { local: 'Chaco For Ever',      visita: 'Alte. Brown' },
    { local: 'Acassuso',            visita: 'Mitre (SE)' },
    { local: 'San Telmo',           visita: 'Estudiantes (RC)' },
    { local: 'San Miguel',          visita: 'All Boys' },
    { local: 'Colón',               visita: 'Los Andes' },
    { local: 'Dep. Morón',          visita: 'Godoy Cruz' },
  ]},
  { fecha: 31, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Godoy Cruz' },
    { local: 'Los Andes',           visita: 'Dep. Morón' },
    { local: 'All Boys',            visita: 'Colón' },
    { local: 'Estudiantes (RC)',    visita: 'San Miguel' },
    { local: 'Mitre (SE)',           visita: 'San Telmo' },
    { local: 'Alte. Brown',         visita: 'Acassuso' },
    { local: 'Cdad. de Bolívar',    visita: 'Chaco For Ever' },
    { local: 'Def. de Belgrano',    visita: 'Ferro Carril Oeste' },
    { local: 'Dep. Madryn',         visita: 'Ctral. Norte' },
  ]},
  { fecha: 32, partidos: [
    { local: 'Ctral. Norte',        visita: 'Racing (Cba.)' },
    { local: 'Ferro Carril Oeste',  visita: 'Dep. Madryn' },
    { local: 'Chaco For Ever',      visita: 'Def. de Belgrano' },
    { local: 'Acassuso',            visita: 'Cdad. de Bolívar' },
    { local: 'San Telmo',           visita: 'Alte. Brown' },
    { local: 'San Miguel',          visita: 'Mitre (SE)' },
    { local: 'Colón',               visita: 'Estudiantes (RC)' },
    { local: 'Dep. Morón',          visita: 'All Boys' },
    { local: 'Godoy Cruz',          visita: 'Los Andes' },
  ]},
  { fecha: 33, partidos: [
    { local: 'Racing (Cba.)',       visita: 'Los Andes' },
    { local: 'All Boys',            visita: 'Godoy Cruz' },
    { local: 'Estudiantes (RC)',    visita: 'Dep. Morón' },
    { local: 'Mitre (SE)',           visita: 'Colón' },
    { local: 'Alte. Brown',         visita: 'San Miguel' },
    { local: 'Cdad. de Bolívar',    visita: 'San Telmo' },
    { local: 'Def. de Belgrano',    visita: 'Acassuso' },
    { local: 'Dep. Madryn',         visita: 'Chaco For Ever' },
    { local: 'Ctral. Norte',        visita: 'Ferro Carril Oeste' },
  ]},
  { fecha: 34, partidos: [
    { local: 'Ferro Carril Oeste',  visita: 'Racing (Cba.)' },
    { local: 'Chaco For Ever',      visita: 'Ctral. Norte' },
    { local: 'Acassuso',            visita: 'Dep. Madryn' },
    { local: 'San Telmo',           visita: 'Def. de Belgrano' },
    { local: 'San Miguel',          visita: 'Cdad. de Bolívar' },
    { local: 'Colón',               visita: 'Alte. Brown' },
    { local: 'Dep. Morón',          visita: 'Mitre (SE)' },
    { local: 'Godoy Cruz',          visita: 'Estudiantes (RC)' },
    { local: 'Los Andes',           visita: 'All Boys' },
  ]},
  { fecha: 35, partidos: [
    { local: 'Racing (Cba.)',       visita: 'All Boys' },
    { local: 'Estudiantes (RC)',    visita: 'Los Andes' },
    { local: 'Mitre (SE)',           visita: 'Godoy Cruz' },
    { local: 'Alte. Brown',         visita: 'Dep. Morón' },
    { local: 'Cdad. de Bolívar',    visita: 'Colón' },
    { local: 'Def. de Belgrano',    visita: 'San Miguel' },
    { local: 'Dep. Madryn',         visita: 'San Telmo' },
    { local: 'Ctral. Norte',        visita: 'Acassuso' },
    { local: 'Ferro Carril Oeste',  visita: 'Chaco For Ever' },
  ]},
  { fecha: 36, partidos: [
    { local: 'Chaco For Ever',      visita: 'Racing (Cba.)' },
    { local: 'Acassuso',            visita: 'Ferro Carril Oeste' },
    { local: 'San Telmo',           visita: 'Ctral. Norte' },
    { local: 'San Miguel',          visita: 'Dep. Madryn' },
    { local: 'Colón',               visita: 'Def. de Belgrano' },
    { local: 'Dep. Morón',          visita: 'Cdad. de Bolívar' },
    { local: 'Godoy Cruz',          visita: 'Alte. Brown' },
    { local: 'Los Andes',           visita: 'Mitre (SE)' },
    { local: 'All Boys',            visita: 'Estudiantes (RC)' },
  ]},
];

// Horarios tentativos — sábados 15:30, una fecha por semana desde el 14/02/2026
// Las fechas 7 y 25 son la fecha interzona (todos contra todos)
const FECHA_INICIO = new Date('2026-02-14T15:30:00');

function getFechaInicio(nroFecha: number): Date {
  const d = new Date(FECHA_INICIO);
  d.setDate(d.getDate() + (nroFecha - 1) * 7);
  return d;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const matchdaysRepo = app.get<Repository<Matchday>>(getRepositoryToken(Matchday));
  const matchesRepo   = app.get<Repository<Match>>(getRepositoryToken(Match));

  console.log('🌱 Importando fixture Zona A Primera Nacional 2026...\n');

  let totalFechas = 0;
  let totalPartidos = 0;
  let saltados = 0;

  for (const fecha of ZONA_A) {
    // Crear o reusar matchday
    let matchday = await matchdaysRepo.findOne({ where: { numero: fecha.fecha, seasonId: 1 } });
    if (!matchday) {
      const fechaInicio = getFechaInicio(fecha.fecha);
      matchday = await matchdaysRepo.save(matchdaysRepo.create({
        seasonId: 1,
        numero: fecha.fecha,
        fechaLimite: fechaInicio,
      }));
      totalFechas++;
      console.log('📅 Fecha ' + fecha.fecha + ' creada (' + matchday.id + ')');
    }

    for (const p of fecha.partidos) {
      const existe = await matchesRepo.findOne({
        where: { matchdayId: matchday.id, equipoLocal: p.local, equipoVisitante: p.visita }
      });

      if (!existe) {
        const inicio = getFechaInicio(fecha.fecha);
        await matchesRepo.save(matchesRepo.create({
          matchdayId: matchday.id,
          equipoLocal: p.local,
          equipoVisitante: p.visita,
          inicio,
        }));
        console.log('  ⚽ ' + p.local + ' vs ' + p.visita);
        totalPartidos++;
      } else {
        saltados++;
      }
    }
  }

  console.log('\n✅ Importación completa:');
  console.log('   Fechas creadas:   ' + totalFechas);
  console.log('   Partidos creados: ' + totalPartidos);
  console.log('   Saltados:         ' + saltados);

  await app.close();
}

bootstrap();
