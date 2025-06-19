//PRODUCTO DENTRO DE LA OSLI , SOLO UNO
export interface ProductoSolicitado {
  nombre: string;
  cantidad: number;
  userId: number; 
}

//ESTRUCTURA SOLI
export interface Solicitud {
  id?: number; 
  usuario: number; 
  productos_solicitados: ProductoSolicitado[]; 
  creada_en?: string; 
}


export interface SolicitudDb {
  id: number;
  usuario: number;
  productos_solicitados: string; 
  creada_en: Date ; 
}