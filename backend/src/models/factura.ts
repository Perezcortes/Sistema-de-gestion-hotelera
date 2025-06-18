export class Factura {
  constructor(
    public nombre: string,
    public email: string,
    public telefono: string,
    public destino: string,
    public fechaLlegada: string,
    public horaLlegada: string,
    public fechaSalida: string,
    public horaSalida: string,
    public noches: number,
    public numeroPersonas: number,
    public tipoHabitacion: string,
    public serviciosExtra: string[],
    public metodoPago: string,
    public comentarios?: string,
    public total: number = 0
  ) {}

  generarResumen() {
    return `Factura para ${this.nombre}: $${this.total.toLocaleString()}`;
  }
}
