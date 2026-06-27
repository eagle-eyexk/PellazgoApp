//
//  CheckoutView.swift
//  Pellazgo
//

import SwiftUI
import Stripe

struct CheckoutView: View {
    @Environment(\.dismiss) var dismiss
    @State private var isLoading = false
    @State private var paymentSuccess = false
    
    var body: some View {
        NavigationView {
            VStack {
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Përmbledhje e Porosisë").font(.headline)
                            HStack { Text("Nën totali"); Spacer(); Text("€XX.XX") }
                            HStack { Text("Transporti"); Spacer(); Text("€0.00").foregroundColor(.green) }
                            Divider()
                            HStack { Text("Totali").font(.headline); Spacer(); Text("€XX.XX").font(.title3).fontWeight(.bold) }
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                        
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Adresa e Dërgesës").font(.headline)
                            TextField("Emri i plotë", text: .constant("")).textFieldStyle(RoundedBorderTextFieldStyle())
                            TextField("Adresa", text: .constant("")).textFieldStyle(RoundedBorderTextFieldStyle())
                            TextField("Qyteti", text: .constant("")).textFieldStyle(RoundedBorderTextFieldStyle())
                            TextField("Kodi Postar", text: .constant("")).textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                        
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Pagesa").font(.headline)
                            PaymentButton {
                                isLoading = true
                                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                                    isLoading = false
                                    paymentSuccess = true
                                }
                            }
                        }
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                    .padding()
                }
            }
            .navigationTitle("Porosit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Anulo") { dismiss() }
                }
            }
            .overlay {
                if isLoading {
                    ProgressView()
                        .scaleEffect(1.5)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.black.opacity(0.2))
                }
            }
            .alert("Porosisë u Krye!", isPresented: $paymentSuccess) {
                Button("OK") { dismiss() }
            } message: {
                Text("Porosia juaj u konfirmua me sukses. Do të merrni një email konfirmimi.")
            }
        }
    }
}

struct PaymentButton: View {
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: "lock.fill")
                Text("Paguaj me Kartë")
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
    }
}
