//
//  ProfileView.swift
//  Pellazgo
//

import SwiftUI
import FirebaseAuth

struct ProfileView: View {
    @EnvironmentObject var appState: AppState
    @State private var showSignOutAlert = false
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Circle()
                            .fill(Color.blue.opacity(0.2))
                            .frame(width: 60, height: 60)
                            .overlay(Image(systemName: "person.fill").font(.title).foregroundColor(.blue))
                        VStack(alignment: .leading) {
                            Text(appState.currentUser?.name ?? "Përdorues").font(.headline)
                            Text(appState.currentUser?.email ?? "").font(.caption).foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }
                Section("Porositë") {
                    NavigationLink("Historiku i Porosive") { Text("Historiku i Porosive") }
                    NavigationLink("Gjurmo Porosinë") { Text("Gjurmo Porosinë") }
                }
                Section("Preferencat") {
                    NavigationLink("Profili") { Text("Profili") }
                    NavigationLink("Adresat") { Text("Adresat") }
                    NavigationLink("Mënyrat e Pagesës") { Text("Mënyrat e Pagesës") }
                }
                Section("Rreth Pellazgo") {
                    NavigationLink("Rreth Nesh") { Text("Rreth Nesh") }
                    NavigationLink("Kontakt") { Text("Kontakt") }
                    NavigationLink("Politika e Kthimit") { Text("Politika e Kthimit") }
                }
                Section {
                    Button("Dil") { showSignOutAlert = true }
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity, alignment: .center)
                }
            }
            .navigationTitle("Profili")
            .navigationBarTitleDisplayMode(.inline)
            .alert("Dil", isPresented: $showSignOutAlert) {
                Button("Anulo", role: .cancel) { }
                Button("Dil", role: .destructive) { try? Auth.auth().signOut() }
            } message: { Text("A jeni i sigurt që doni të dilni?") }
        }
    }
}
