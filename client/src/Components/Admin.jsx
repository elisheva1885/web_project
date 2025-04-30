import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

const Admin = () => {
    const { userDetails } = useSelector((state) => state.userDetails);
    const { overheads } = useSelector((state) => state.overheads);
    // const { miniCentrals } = useSelector((state) => state.miniCentrals);

    // const air_conditioners = null
    const navigate = useNavigate()
    const registerOfficial = async (data) => {
        navigate('/admin/registerOfficial')
        const official = {
            // name: data.name,
            // username: data.username,
            // password: data.password,
            // email: data.email,
            // phone: data.phone,
            // roles: 'official'
        }
        // onSubmit(official)
    }
    // const exportPdf = () => {
    //     import('jspdf').then((jsPDF) => {
    //         import('jspdf-autotable').then(() => {
    //             const doc = new jsPDF.default(0, 0);

    //             doc.autoTable(exportColumns, overheads);
    //             doc.save('overheads.pdf');
    //         });
    //     });
    // };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(overheads);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['overheads'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'overheads');
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    // const cols = [
    //     { field: 'code', header: 'Code' },
    //     { field: 'name', header: 'Name' },
    //     { field: 'category', header: 'Category' },
    //     { field: 'quantity', header: 'Quantity' }
    // ];
    // const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));


    return (
        <>
            <div style={{ paddingTop: '60px' }}>
                <Button type="button" label="הוספת מזכירה" className="mt-2" onClick={registerOfficial} />
            </div>
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            {/* <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" /> */}
        </>
    )
}
export default Admin