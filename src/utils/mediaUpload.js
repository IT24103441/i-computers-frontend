import { createClient } from "@supabase/supabase-js";

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGZ2bWVtcmFjcWVmaWJhcm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDk2NTAsImV4cCI6MjA5MzIyNTY1MH0.fkcu0XVcG_geo9OABJ5Bs0olrnBrA46DhTFx0ZwrGlA"
const url = "https://yxxfvmemracqefibarni.supabase.co"

const supabase = createClient(url, key)

export default function uploadMedia(file) {
    return new Promise(
        (resolve, reject) => {
            if (file == null) {
                reject("No file selected")
            } else {
                const timestamp = new Date().getTime()
                const fileName = timestamp + "-" + file.name
                supabase.storage.from("images").upload(fileName, file, { upsert: true }).then((res) => {
                    if (res.error) {
                        reject(res.error.message || res.error);
                        return;
                    }
                    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
                    resolve(data.publicUrl);
                })
                    .catch((error) => {
                        reject(error);
                    });
            }
        }
    );
}