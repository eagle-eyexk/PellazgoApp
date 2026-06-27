//
//  CartView.swift
//  Pellazgo
//

import SwiftUI

struct CartView: View {
    @EnvironmentObject var cartViewModel: CartViewModel
    @State private var showCheckout = false
    
    var body: some View {
        NavigationView {
            if cartViewModel.items.isEmpty {
                VStack(spacing: 20) {
                    Image(systemName: "cart").font(.system(size: 60)).foregroundColor(.secondary)
                    Text("Shporta juaj është bosh").font(.headline).foregroundColor(.secondary)
                    Text("Zbuloni produktet tona dhe shtoni artikuj të preferuar.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    NavigationLink("Shiko Dyqanin") { ShopView() }
                        .buttonStyle(.borderedProminent)
                        .tint(.blue)
                }
                .navigationTitle("Shporta")
                .navigationBarTitleDisplayMode(.inline)
            } else {
                VStack {
                    ScrollView {
                        VStack(spacing: 12) {
                            ForEach(cartViewModel.items) { item in
                                CartItemRow(item: item)
                            }
                        }
                        .padding()
                    }
                    VStack(spacing: 12) {
                        HStack {
                            Text("Totali").font(.headline)
                            Spacer()
                            Text("€XX.XX").font(.title3).fontWeight(.bold)
                        }
                        .padding(.horizontal)
                        Button("Vazhdo të Porosisësh") {
                            showCheckout = true
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.blue)
                        .frame(maxWidth: .infinity)
                        .padding(.horizontal)
                        .padding(.bottom, 8)
                    }
                    .padding(.vertical)
                    .background(Color(.systemBackground))
                    .shadow(color: .black.opacity(0.05), radius: -4, x: 0, y: -4)
                }
                .navigationTitle("Shporta")
                .navigationBarTitleDisplayMode(.inline)
                .sheet(isPresented: $showCheckout) {
                    CheckoutView()
                }
            }
        }
    }
}

struct CartItemRow: View {
    let item: CartItem
    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray5))
                .frame(width: 70, height: 70)
            VStack(alignment: .leading, spacing: 4) {
                Text(item.productName).font(.subheadline).fontWeight(.medium).lineLimit(2)
                Text("€\(item.price, specifier: "%.2f")")
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                HStack {
                    Button(action: { /* Decrease */ }) { Image(systemName: "minus.circle") }
                    Text("\(item.quantity)").font(.subheadline).frame(minWidth: 30)
                    Button(action: { /* Increase */ }) { Image(systemName: "plus.circle") }
                }
                .foregroundColor(.blue)
            }
            Spacer()
            Button(action: { /* Remove */ }) { Image(systemName: "trash").foregroundColor(.red) }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct CartItem: Identifiable {
    let id: String
    let productName: String
    let price: Double
    var quantity: Int
}
