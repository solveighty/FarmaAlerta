function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const action = e.parameter.action || "getFarmacias";

  if (action === "getFarmacias") {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const farmacias = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        farmacias.push({
          id: i.toString(),
          nombre: row[0],
          email: row[1],
          contraseña: row[2],
          dirección: row[3],
          teléfono: row[4],
          estado: row[5],
          horario: row[6],
          urlFoto: row[7],
          latitud: parseFloat(row[8]) || null,
          longitud: parseFloat(row[9]) || null,
        });
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify(farmacias)
    ).setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getProductos") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const productosSheet = ss.getSheetByName("Productos");

    if (!productosSheet) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(
        ContentService.MimeType.JSON
      );
    }

    const data = productosSheet.getDataRange().getValues();
    const productos = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1]) {
        productos.push({
          id: row[0] || i.toString(),
          nombreProducto: row[1],
          descripción: row[2],
          precio: parseFloat(row[3]) || 0,
          cantidad: parseInt(row[4]) || 0,
          categoría: row[5],
          fechaCaducidad: row[6],
          emailFarmacia: row[7],
          urlFoto: row[8],
        });
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify(productos)
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === "addProducto") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const productosSheet = ss.getSheetByName("Productos");

      if (!productosSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Sheet Productos no existe",
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const producto = payload.producto;
      const nextId = Utilities.getUuid();

      Logger.log("DEBUG - Producto a guardar:", producto);
      Logger.log("DEBUG - urlFoto:", producto.urlFoto);

      const rowData = [
        nextId,
        producto.nombreProducto,
        producto.descripción,
        producto.precio,
        producto.cantidad,
        producto.categoría,
        producto.fechaCaducidad,
        producto.emailFarmacia,
        producto.urlFoto || "",
      ];

      Logger.log("DEBUG - Row data:", rowData);
      productosSheet.appendRow(rowData);

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === "updateFoto") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const farmaciaSheet = ss.getSheetByName("Farmacias");

      if (!farmaciaSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Sheet Farmacias no existe",
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const email = payload.email;
      const urlFoto = payload.urlFoto;

      Logger.log("DEBUG - Actualizando foto para email:", email);
      Logger.log("DEBUG - Nueva URL:", urlFoto);

      const data = farmaciaSheet.getDataRange().getValues();

      // Buscar la fila con el email coincidente (columna B = índice 1)
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === email) {
          // Actualizar columna H (índice 7) con la nueva URL
          farmaciaSheet.getRange(i + 1, 8).setValue(urlFoto);

          Logger.log("DEBUG - Foto actualizada en fila:", i + 1);

          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              message: "Foto de farmacia actualizada correctamente",
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Farmacia no encontrada",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === "updateProducto") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const productosSheet = ss.getSheetByName("Productos");

      if (!productosSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Sheet Productos no existe",
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const producto = payload.producto;
      const productId = payload.producto.id;
      const emailFarmacia = payload.producto.emailFarmacia;
      const nombreProducto = payload.producto.nombreProducto;

      Logger.log("DEBUG - Actualizando producto con ID:", productId);

      const data = productosSheet.getDataRange().getValues();

      // Buscar la fila con el ID coincidente (columna A = índice 0)
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === productId) {
          // Actualizar todas las columnas del producto
          productosSheet.getRange(i + 1, 2).setValue(producto.nombreProducto); // Columna B
          productosSheet.getRange(i + 1, 3).setValue(producto.descripción); // Columna C
          productosSheet.getRange(i + 1, 4).setValue(producto.precio); // Columna D
          productosSheet.getRange(i + 1, 5).setValue(producto.cantidad); // Columna E
          productosSheet.getRange(i + 1, 6).setValue(producto.categoría); // Columna F
          productosSheet.getRange(i + 1, 7).setValue(producto.fechaCaducidad); // Columna G
          productosSheet.getRange(i + 1, 8).setValue(producto.emailFarmacia); // Columna H
          productosSheet.getRange(i + 1, 9).setValue(producto.urlFoto || ""); // Columna I

          Logger.log("DEBUG - Producto actualizado en fila:", i + 1);

          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              message: "Producto actualizado correctamente",
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Fallback: buscar por email + nombreProducto si el ID no coincide
      Logger.log("DEBUG - ID no encontrado, buscando por email y nombre...");
      for (let i = 1; i < data.length; i++) {
        if (data[i][7] === emailFarmacia && data[i][1] === nombreProducto) {
          // Actualizar todas las columnas del producto
          productosSheet.getRange(i + 1, 1).setValue(productId); // Actualizar ID con UUID
          productosSheet.getRange(i + 1, 2).setValue(producto.nombreProducto); // Columna B
          productosSheet.getRange(i + 1, 3).setValue(producto.descripción); // Columna C
          productosSheet.getRange(i + 1, 4).setValue(producto.precio); // Columna D
          productosSheet.getRange(i + 1, 5).setValue(producto.cantidad); // Columna E
          productosSheet.getRange(i + 1, 6).setValue(producto.categoría); // Columna F
          productosSheet.getRange(i + 1, 7).setValue(producto.fechaCaducidad); // Columna G
          productosSheet.getRange(i + 1, 8).setValue(producto.emailFarmacia); // Columna H
          productosSheet.getRange(i + 1, 9).setValue(producto.urlFoto || ""); // Columna I

          Logger.log(
            "DEBUG - Producto actualizado en fila (por email+nombre):",
            i + 1
          );

          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              message: "Producto actualizado correctamente",
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === "deleteProducto") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const productosSheet = ss.getSheetByName("Productos");

      if (!productosSheet) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Sheet Productos no existe",
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const productId = payload.id;
      const emailFarmacia = payload.emailFarmacia;
      const nombreProducto = payload.nombreProducto;

      Logger.log("DEBUG - Eliminando producto con ID:", productId);

      const data = productosSheet.getDataRange().getValues();

      // Buscar la fila con el ID coincidente (columna A = índice 0)
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === productId) {
          // Eliminar la fila (i + 1 porque Google Sheets usa indexado desde 1)
          productosSheet.deleteRow(i + 1);

          Logger.log("DEBUG - Producto eliminado de fila:", i + 1);

          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              message: "Producto eliminado correctamente",
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Fallback: buscar por email + nombreProducto si el ID no coincide
      Logger.log("DEBUG - ID no encontrado, buscando por email y nombre...");
      for (let i = 1; i < data.length; i++) {
        if (data[i][7] === emailFarmacia && data[i][1] === nombreProducto) {
          // Eliminar la fila
          productosSheet.deleteRow(i + 1);

          Logger.log(
            "DEBUG - Producto eliminado de fila (por email+nombre):",
            i + 1
          );

          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              message: "Producto eliminado correctamente",
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Producto no encontrado",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Acción no válida",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("ERROR:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
