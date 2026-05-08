// ══════════════════════════════════════════════════════════════════════
//  GOOGLE APPS SCRIPT — Backend para el formulario de inscripción
//  Cena Calentamiento · GymWoman Polop
//  Creado por Masesora
// ══════════════════════════════════════════════════════════════════════
//
//  INSTRUCCIONES DE INSTALACIÓN (5 pasos):
//
//  1. Ve a https://sheets.google.com → crea una hoja nueva
//     Llámala "Inscripciones Cena Calentamiento"
//
//  2. En la hoja, ve a Extensiones → Apps Script
//
//  3. Borra todo el código que haya y pega este archivo completo
//
//  4. Haz clic en "Implementar" → "Nueva implementación"
//       · Tipo: Aplicación web
//       · Ejecutar como: Yo (tu cuenta)
//       · Quién tiene acceso: Cualquier persona
//     Copia la URL que aparece al final ("URL de la aplicación web")
//
//  5. En el archivo cena-calentamiento.html, busca la línea:
//        APPS_SCRIPT_URL: "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT"
//     y sustituye el texto entre comillas por la URL que copiaste
//
//  ¡Listo! Cada inscripción aparecerá automáticamente en tu hoja.
// ══════════════════════════════════════════════════════════════════════

// ID de tu hoja de cálculo (se rellena automáticamente con SpreadsheetApp.getActiveSpreadsheet)
// Si usas un ID fijo, cámbialo aquí:
const SHEET_ID = null; // null = usa la hoja activa donde está el script

// Nombre de la pestaña donde se guardarán los datos
const SHEET_NAME = "Inscripciones";

// Columnas de la cabecera
const HEADERS = ["Nombre", "Apellidos", "Teléfono", "¿Socia del gym?", "Fecha de inscripción", "IP (aprox)"];

// ──────────────────────────────────────────────────────────────────────
//  doPost: recibe los datos del formulario y los guarda en la hoja
// ──────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SHEET_ID
      ? SpreadsheetApp.openById(SHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(SHEET_NAME);

    // Crear pestaña si no existe y añadir cabeceras
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight("bold")
        .setBackground("#C9A96E")
        .setFontColor("#0F0D0E");
      sheet.setFrozenRows(1);
    }

    // Añadir fila con los datos
    sheet.appendRow([
      data.nombre          || "",
      data.apellidos       || "",
      data.telefono        || "",
      data.socia           || "",
      data.fecha_inscripcion || new Date().toLocaleString("es-ES"),
      ""  // IP — no disponible desde Apps Script en modo no-cors
    ]);

    // Devolver respuesta OK
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ──────────────────────────────────────────────────────────────────────
//  doGet: permite hacer una prueba desde el navegador
// ──────────────────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput("✅ El script de Cena Calentamiento está activo y funcionando.")
    .setMimeType(ContentService.MimeType.TEXT);
}
