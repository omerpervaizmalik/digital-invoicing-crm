import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // 1. Read FBR References
    const filePath = path.join(process.cwd(), 'src', 'lib', 'fbrReferences.json');
    const fbrData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const rates = (fbrData.rates || []).map((r: string) => parseFloat(r));
    const uoms = fbrData.uoms || [];
    const saleTypes = fbrData.saleTypes || [];
    const petroleumLevyOn = fbrData.petroleumLevyOn || [];
    const sros = fbrData.sros || [];
    const itemSrNos = fbrData.itemSrNos || [];
    const hsCodesList = (fbrData.hsCodes || []).map((h: any) => 
      h.description && h.description !== '-' ? `${h.code} - ${h.description}` : h.code
    );

    // 2. Create Excel Workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add reference lists sheet
    const listSheet = workbook.addWorksheet('Lists');
    listSheet.state = 'hidden'; // Hide this sheet to keep the workbook clean

    // Populate lists sheet columns
    listSheet.getCell('A1').value = 'Rates';
    listSheet.getCell('B1').value = 'UOMs';
    listSheet.getCell('C1').value = 'SaleTypes';
    listSheet.getCell('D1').value = 'PetroleumLevyOn';
    listSheet.getCell('E1').value = 'SROs';
    listSheet.getCell('F1').value = 'ItemSrNos';
    listSheet.getCell('G1').value = 'HSCodes';

    const maxLength = Math.max(
      rates.length,
      uoms.length,
      saleTypes.length,
      petroleumLevyOn.length,
      sros.length,
      itemSrNos.length,
      hsCodesList.length
    );

    for (let i = 0; i < maxLength; i++) {
      const rowNum = i + 2;
      if (i < rates.length) listSheet.getCell(`A${rowNum}`).value = rates[i];
      if (i < uoms.length) listSheet.getCell(`B${rowNum}`).value = uoms[i];
      if (i < saleTypes.length) listSheet.getCell(`C${rowNum}`).value = saleTypes[i];
      if (i < petroleumLevyOn.length) listSheet.getCell(`D${rowNum}`).value = petroleumLevyOn[i];
      if (i < sros.length) listSheet.getCell(`E${rowNum}`).value = sros[i];
      if (i < itemSrNos.length) listSheet.getCell(`F${rowNum}`).value = itemSrNos[i];
      if (i < hsCodesList.length) listSheet.getCell(`G${rowNum}`).value = hsCodesList[i];
    }

    // Format Rates column on lists sheet as percent
    for (let i = 0; i < rates.length; i++) {
      listSheet.getCell(`A${i+2}`).numFmt = '0%';
    }

    // Add main Product Template sheet
    const templateSheet = workbook.addWorksheet('Product Template');
    templateSheet.views = [
      { showGridLines: true } // Ensure grid lines are visible
    ];

    // Define columns
    const columns = [
      { header: 'Product Code', key: 'itemCode', width: 15 },
      { header: 'Product Description', key: 'productDescription', width: 35 },
      { header: 'HS Code', key: 'hsCode', width: 15 },
      { header: 'Sales Tax Rate', key: 'rate', width: 18 },
      { header: 'UOM', key: 'uoM', width: 22 },
      { header: 'Unit Price', key: 'unitPrice', width: 15 },
      { header: 'Retail Price', key: 'fixedNotifiedValueOrRetailPrice', width: 15 },
      { header: 'Initial Stock Quantity', key: 'initialStock', width: 22 },
      { header: 'Initial Stock Total Value', key: 'initialStockValue', width: 25 },
      { header: 'Sale Type', key: 'saleType', width: 35 },
      { header: 'SRO Schedule No', key: 'sroScheduleNo', width: 20 },
      { header: 'SRO Item Serial No', key: 'sroItemSerialNo', width: 20 },
      { header: 'Petroleum Levy On', key: 'petroleumLevyOn', width: 20 }
    ];

    templateSheet.columns = columns;

    // Header styling
    const headerRow = templateSheet.getRow(1);
    headerRow.height = 32;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF065F46' } // Dark emerald
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' } // White
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF047857' } },
        bottom: { style: 'medium', color: { argb: 'FF022C22' } },
        left: { style: 'thin', color: { argb: 'FF047857' } },
        right: { style: 'thin', color: { argb: 'FF047857' } }
      };
    });

    // Populate Sample Data
    const sampleData = [
      {
        itemCode: 'PRD-001',
        productDescription: 'Agricultural Machinery Parts',
        hsCode: '8432.9010',
        rate: 0.18,
        uoM: 'Numbers, pieces, units',
        unitPrice: 12500.00,
        fixedNotifiedValueOrRetailPrice: 0.00,
        initialStock: 50,
        initialStockValue: 625000.00,
        saleType: 'Goods at standard rate (default)',
        sroScheduleNo: '',
        sroItemSerialNo: '',
        petroleumLevyOn: ''
      },
      {
        itemCode: 'PRD-002',
        productDescription: 'Iron Castings',
        hsCode: '7325.1000',
        rate: 0.18,
        uoM: 'KG',
        unitPrice: 450.00,
        fixedNotifiedValueOrRetailPrice: 0.00,
        initialStock: 1000,
        initialStockValue: 450000.00,
        saleType: 'Goods at standard rate (default)',
        sroScheduleNo: '',
        sroItemSerialNo: '',
        petroleumLevyOn: ''
      }
    ];

    sampleData.forEach((item) => {
      templateSheet.addRow(item);
    });

    // Style data rows and apply formulas/formats
    const thinBorder = {
      top: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } }
    };

    const rateValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$A$2:$A$${rates.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Rate',
      error: 'Please select a rate from the dropdown list.'
    };

    const hsCodeValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$G$2:$G$${hsCodesList.length + 1}`],
      showErrorMessage: false, // Allows searchable typing in modern Excel
      errorTitle: 'Invalid HS Code',
      error: 'Please select a valid HS Code from the list.'
    };

    const uomValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$B$2:$B$${uoms.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid UOM',
      error: 'Please select a unit of measure from the dropdown list.'
    };

    const saleTypeValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$C$2:$C$${saleTypes.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Sale Type',
      error: 'Please select a sale type from the dropdown list.'
    };

    const sroValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$E$2:$E$${sros.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid SRO',
      error: 'Please select an SRO Schedule No from the dropdown list.'
    };

    const serialValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$F$2:$F$${itemSrNos.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Serial No',
      error: 'Please select a serial number from the dropdown list.'
    };

    const levyValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`Lists!$D$2:$D$${petroleumLevyOn.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Petroleum Levy',
      error: 'Please select a petroleum levy option from the dropdown list.'
    };

    // Apply styles to the populated sample rows and set formats for columns 2 to 1000
    for (let r = 2; r <= 1000; r++) {
      const row = templateSheet.getRow(r);
      row.height = 24;

      // Product Code
      const c1 = row.getCell(1);
      c1.alignment = { vertical: 'middle', horizontal: 'left' };
      c1.border = thinBorder;
      c1.font = { name: 'Segoe UI', size: 10 };

      // Product Description
      const c2 = row.getCell(2);
      c2.alignment = { vertical: 'middle', horizontal: 'left' };
      c2.border = thinBorder;
      c2.font = { name: 'Segoe UI', size: 10 };

      // HS Code
      const c3 = row.getCell(3);
      c3.alignment = { vertical: 'middle', horizontal: 'center' };
      c3.border = thinBorder;
      c3.font = { name: 'Segoe UI', size: 10, bold: true };
      c3.dataValidation = hsCodeValidation;

      // Sales Tax Rate
      const c4 = row.getCell(4);
      c4.numFmt = '0%';
      c4.alignment = { vertical: 'middle', horizontal: 'center' };
      c4.border = thinBorder;
      c4.font = { name: 'Segoe UI', size: 10 };
      c4.dataValidation = rateValidation;

      // UOM
      const c5 = row.getCell(5);
      c5.alignment = { vertical: 'middle', horizontal: 'left' };
      c5.border = thinBorder;
      c5.font = { name: 'Segoe UI', size: 10 };
      c5.dataValidation = uomValidation;

      // Unit Price
      const c6 = row.getCell(6);
      c6.numFmt = '#,##0.00';
      c6.alignment = { vertical: 'middle', horizontal: 'right' };
      c6.border = thinBorder;
      c6.font = { name: 'Segoe UI', size: 10 };

      // Retail Price
      const c7 = row.getCell(7);
      c7.numFmt = '#,##0.00';
      c7.alignment = { vertical: 'middle', horizontal: 'right' };
      c7.border = thinBorder;
      c7.font = { name: 'Segoe UI', size: 10 };

      // Initial Stock Qty
      const c8 = row.getCell(8);
      c8.numFmt = '#,##0.00';
      c8.alignment = { vertical: 'middle', horizontal: 'right' };
      c8.border = thinBorder;
      c8.font = { name: 'Segoe UI', size: 10 };

      // Initial Stock Value
      const c9 = row.getCell(9);
      c9.numFmt = '#,##0.00';
      c9.alignment = { vertical: 'middle', horizontal: 'right' };
      c9.border = thinBorder;
      c9.font = { name: 'Segoe UI', size: 10 };

      // Sale Type
      const c10 = row.getCell(10);
      c10.alignment = { vertical: 'middle', horizontal: 'left' };
      c10.border = thinBorder;
      c10.font = { name: 'Segoe UI', size: 10 };
      c10.dataValidation = saleTypeValidation;

      // SRO Schedule No
      const c11 = row.getCell(11);
      c11.alignment = { vertical: 'middle', horizontal: 'left' };
      c11.border = thinBorder;
      c11.font = { name: 'Segoe UI', size: 10 };
      c11.dataValidation = sroValidation;

      // SRO Item Serial No
      const c12 = row.getCell(12);
      c12.alignment = { vertical: 'middle', horizontal: 'left' };
      c12.border = thinBorder;
      c12.font = { name: 'Segoe UI', size: 10 };
      c12.dataValidation = serialValidation;

      // Petroleum Levy On
      const c13 = row.getCell(13);
      c13.alignment = { vertical: 'middle', horizontal: 'left' };
      c13.border = thinBorder;
      c13.font = { name: 'Segoe UI', size: 10 };
      c13.dataValidation = levyValidation;
    }

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=product_upload_template.xlsx',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error: any) {
    console.error('Error generating Excel template:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Failed to generate template' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
