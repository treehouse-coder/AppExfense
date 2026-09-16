//==================================================
// API
//==================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbwWPFElfoyIgxnwL9Y7wh-yIGmEoqT_kz_P2LPExjzb-6DTXmxaBedvBDEKt--sv8A0/exec";


//==================================================
// FOTO
//==================================================

let fotoBase64 = "";

let mimeType = "";


//==================================================
// LOAD AWAL
//==================================================

window.onload = function(){

    document.getElementById("tanggal").value =
        new Date()
            .toISOString()
            .split("T")[0];

    loadBarang();

};


//==================================================
// PREVIEW FOTO
//==================================================

function previewFoto(input){

    const file = input.files[0];

    if(!file){

        fotoBase64 = "";

        mimeType = "";

        document
            .getElementById("preview")
            .style.display = "none";

        return;

    }


    compressImage(file)
        .then(function(data){

            fotoBase64 =
                data.split(",")[1];

            mimeType =
                "image/jpeg";


            const img =
                document.getElementById("preview");


            img.src = data;

            img.style.display =
                "block";

        });

}


//==================================================
// COMPRESS IMAGE
//==================================================

function compressImage(file){

    return new Promise(function(resolve){

        const reader =
            new FileReader();


        reader.onload =
            function(e){

                const img =
                    new Image();


                img.onload =
                    function(){

                        let width =
                            img.width;

                        let height =
                            img.height;


                        // Maksimal 1000 px

                        if(width > 1000){

                            height =
                                height *
                                (1000 / width);

                            width = 1000;

                        }


                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            width;

                        canvas.height =
                            height;


                        const ctx =
                            canvas.getContext(
                                "2d"
                            );


                        ctx.drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                        );


                        // JPEG 55%

                        resolve(
                            canvas.toDataURL(
                                "image/jpeg",
                                0.55
                            )
                        );

                    };


                img.src =
                    e.target.result;

            };


        reader.readAsDataURL(file);

    });

}


//==================================================
// SIMPAN
//==================================================

async function simpan(){

    const data = {

        toko:
            document
                .getElementById("toko")
                .value,

        tanggal:
            document
                .getElementById("tanggal")
                .value,

        barang:
            document
                .getElementById("barang")
                .value,

        jumlah:
            document
                .getElementById("jumlah")
                .value,

        harga:
            document
                .getElementById("harga")
                .value,

        fotoBase64:
            fotoBase64,

        mimeType:
            mimeType

    };


    document
        .getElementById("status")
        .innerHTML =
            "Menyimpan...";


    try{

        const response =
            await fetch(
                API_URL,
                {
                    method:"POST",

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if(!result.success){

            throw new Error(
                result.message
            );

        }


        document
            .getElementById("status")
            .innerHTML =
                result.message;


        // RESET

        document
            .getElementById("barang")
            .value = "";


        document
            .getElementById("jumlah")
            .value = "";


        document
            .getElementById("harga")
            .value = "";


        document
            .getElementById("kamera")
            .value = "";


        document
            .getElementById("galeri")
            .value = "";


        document
            .getElementById("preview")
            .style.display =
                "none";


        fotoBase64 = "";

        mimeType = "";


        document
            .getElementById("barang")
            .focus();


    }
    catch(err){

        document
            .getElementById("status")
            .innerHTML =
                "Error : " +
                err.message;

    }

}


//==================================================
// LIHAT DATA
//==================================================

async function lihatData(){

    document
        .getElementById("status")
        .innerHTML =
            "Memuat data...";


    const toko =
        document
            .getElementById("toko")
            .value;


    try{

        const response =
            await fetch(
                API_URL +
                "?action=getData&toko=" +
                encodeURIComponent(toko)
            );


        const result =
            await response.json();


        if(!result.success){

            throw new Error(
                result.message
            );

        }


        tampilData(
            result.data
        );


    }
    catch(err){

        document
            .getElementById("status")
            .innerHTML =
                "Error : " +
                err.message;

    }

}


//==================================================
// TAMPIL DATA
//==================================================

function tampilData(data){

    let html = "";


    data.forEach(function(row){

        html += "<tr>";


        row.forEach(function(col){

            html +=
                "<td>" +
                escapeHTML(col) +
                "</td>";

        });


        html += "</tr>";

    });


    document
        .getElementById("isiData")
        .innerHTML =
            html;


    document
        .getElementById("dataBarang")
        .style.display =
            "block";


    document
        .getElementById("status")
        .innerHTML = "";

}


//==================================================
// LOAD BARANG
//==================================================

async function loadBarang(){

    const toko =
        document
            .getElementById("toko")
            .value;


    try{

        const response =
            await fetch(
                API_URL +
                "?action=getDaftarBarang&toko=" +
                encodeURIComponent(toko)
            );


        const result =
            await response.json();


        if(!result.success){

            throw new Error(
                result.message
            );

        }


        let html = "";


        result.data.forEach(
            function(item){

                html +=
                    "<option value=\"" +
                    escapeHTML(item) +
                    "\">";

            }
        );


        document
            .getElementById("listBarang")
            .innerHTML =
                html;


    }
    catch(err){

        document
            .getElementById("status")
            .innerHTML =
                "Error : " +
                err.message;

    }

}


//==================================================
// ESCAPE HTML
//==================================================

function escapeHTML(value){

    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}