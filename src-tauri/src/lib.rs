#[tauri::command]
fn ping() -> &'static str { "ok" }

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![ping])
    .run(tauri::generate_context!())
    .expect("error while running 再熬一下");
}