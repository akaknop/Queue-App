// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");
// const Swal = require('sweetalert2')

contextBridge.exposeInMainWorld("electron", {
    login: (data) => ipcRenderer.send("user:login", data),
    refreshdata: (data) => ipcRenderer.send("dashboard:getdata", data),
    deletedata: (data) => ipcRenderer.send("dashboard:deletedata", data),
});

ipcRenderer.on("login-failed", (event, args, payload) => {
    args = JSON.parse(args);
    var element = document.getElementById("error-message");
    if (!args['status']) {
        element.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Wrong email or password. Please try again!'
        element.style.color = 'red';
        element.style.fontSize = '13px';
        return;
    }
    sessionStorage.setItem('secert_token', Buffer.from(payload).toString('base64'))
    window.location.href = './dashboard/list.html'
});

ipcRenderer.on("dashboard-senddata", (event, args) => {
    args = JSON.parse(args);
    const container = document.getElementById('my-tbody');
    container.innerHTML = '';
    args.forEach(item => {
        var statusText, statusColor;
        if (item['status'] === 'pending') {
            statusText = 'รอดำเนินการ';
            statusColor = 'badge bg-primary'
        } else if (item['status'] === 'process') {
            statusText = 'กำลังดำเนินการ';
            statusColor = 'badge bg-warning'
        } else if (item['status'] === 'success') {
            statusText = 'ดำเนินการเสร็จสิ้น';
            statusColor = 'badge bg-success'
        }
        const row = document.createElement('tr');

        const patient_name = document.createElement('td');
        const queue_id = document.createElement('td');
        const status = document.createElement('td');
        const sector = document.createElement('td');
        const time = document.createElement('td');
        const view = document.createElement('td');
        const deleteFunction = document.createElement('td');

        patient_name.textContent = item.patient_name
        queue_id.textContent = item.queue_id
        status.innerHTML = `<span class="${statusColor}">${statusText}</span>`
        sector.textContent = getSectorLabel(item.sector)

        const date = new Date(item.time);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // adding 1 to month index to get 1-12 format
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        time.textContent = `${day}/${month}/${year} ${hours}:${minutes} น.`;
        view.innerHTML = '<a href="#" class="btn btn-sm btn-info"><i class="fas fa-eye"></i> View</a>'
        deleteFunction.innerHTML = `<a href="#" data-patientid="${item.patient_name}_${item.queue_id}" class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i> Delete</a>`

        row.appendChild(patient_name);
        row.appendChild(queue_id);
        row.appendChild(status);
        row.appendChild(sector);
        row.appendChild(time);
        row.appendChild(view);
        row.appendChild(deleteFunction);

        container.appendChild(row);
    })

});

ipcRenderer.on("dashboard-deletedata", (event, args) => {

})

getSectorLabel = function (sector) {
    if (sector == 'dentist') {
        return 'ทันตกรรม';
    } else if (sector == 'normal') {
        return 'แผนกทั่วไป';
    }
}