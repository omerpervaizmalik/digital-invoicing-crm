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

    // Define columns and their styles
    const columnDefinitions = [
      { header: 'Product Code', key: 'itemCode', width: 15, align: 'left' },
      { header: 'Product Description', key: 'productDescription', width: 35, align: 'left' },
      { header: 'HS Code', key: 'hsCode', width: 15, align: 'center', bold: true },
      { header: 'Sales Tax Rate', key: 'rate', width: 18, align: 'center', numFmt: '0%' },
      { header: 'UOM', key: 'uoM', width: 22, align: 'left' },
      { header: 'Unit Price', key: 'unitPrice', width: 15, align: 'right', numFmt: '#,##0.00' },
      { header: 'Retail Price', key: 'fixedNotifiedValueOrRetailPrice', width: 15, align: 'right', numFmt: '#,##0.00' },
      { header: 'Initial Stock Quantity', key: 'initialStock', width: 22, align: 'right', numFmt: '#,##0.00' },
      { header: 'Initial Stock Total Value', key: 'initialStockValue', width: 25, align: 'right', numFmt: '#,##0.00' },
      { header: 'Sale Type', key: 'saleType', width: 35, align: 'left' },
      { header: 'SRO Schedule No', key: 'sroScheduleNo', width: 20, align: 'left' },
      { header: 'SRO Item Serial No', key: 'sroItemSerialNo', width: 20, align: 'left' },
      { header: 'Petroleum Levy On', key: 'petroleumLevyOn', width: 20, align: 'left' }
    ];

    templateSheet.columns = columnDefinitions.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width
    }));

    // Apply column styling (efficiently styles all rows in the sheet)
    columnDefinitions.forEach((col, idx) => {
      const column = templateSheet.getColumn(idx + 1);
      column.alignment = { vertical: 'middle', horizontal: col.align as any };
      column.font = { name: 'Segoe UI', size: 10, bold: col.bold || false };
      if (col.numFmt) {
        column.numFmt = col.numFmt;
      }
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

    // Format headers and sample data rows
    const thinBorder = {
      top: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } }
    };

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

    // Style row heights and thin borders for sample rows only (2 and 3)
    [2, 3].forEach((r) => {
      const row = templateSheet.getRow(r);
      row.height = 24;
      row.eachCell((cell) => {
        cell.border = thinBorder;
      });
    });

    // Define validations
    const rateValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$A$2:$A$${rates.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Rate',
      error: 'Please select a rate from the dropdown list.'
    };

    const hsCodeValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$G$2:$G$${hsCodesList.length + 1}`],
      showErrorMessage: false, // Disabling popup makes it searchable and typeable in Excel
      errorTitle: 'Invalid HS Code',
      error: 'Please select a valid HS Code from the list.'
    };

    const uomValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$B$2:$B$${uoms.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid UOM',
      error: 'Please select a unit of measure from the dropdown list.'
    };

    const saleTypeValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$C$2:$C$${saleTypes.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Sale Type',
      error: 'Please select a sale type from the dropdown list.'
    };

    const sroValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$E$2:$E$${sros.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid SRO',
      error: 'Please select an SRO Schedule No from the dropdown list.'
    };

    const serialValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$F$2:$F$${itemSrNos.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Serial No',
      error: 'Please select a serial number from the dropdown list.'
    };

    const levyValidation = {
      type: 'list' as const,
      allowBlank: true,
      formulae: [`'Lists'!$D$2:$D$${petroleumLevyOn.length + 1}`],
      showErrorMessage: true,
      errorTitle: 'Invalid Petroleum Levy',
      error: 'Please select a petroleum levy option from the dropdown list.'
    };

    // Apply Range-Based Data Validations (Prevent file corruption and allow Excel native dropdown autocompletion)
    const rawSheet = templateSheet as any;
    rawSheet.dataValidations.add('C2:C1000', hsCodeValidation);
    rawSheet.dataValidations.add('D2:D1000', rateValidation);
    rawSheet.dataValidations.add('E2:E1000', uomValidation);
    rawSheet.dataValidations.add('J2:J1000', saleTypeValidation);
    rawSheet.dataValidations.add('K2:K1000', sroValidation);
    rawSheet.dataValidations.add('L2:L1000', serialValidation);
    rawSheet.dataValidations.add('M2:M1000', levyValidation);

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
