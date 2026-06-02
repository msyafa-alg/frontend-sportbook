import * as XLSX from "xlsx";

// exportToExcel : fungsi reusable untuk export data ke file .xlsx
// data     : array of object (data yang mau di-export)
// filename : nama file tanpa ekstensi
// sheetName: nama sheet di dalam Excel
export function exportToExcel(data, filename, sheetName = "Data") {
    // buat worksheet dari array of object
    const worksheet = XLSX.utils.json_to_sheet(data);

    // buat workbook baru
    const workbook = XLSX.utils.book_new();

    // masukkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}
