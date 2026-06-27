//
//  ShopView.swift
//  Pellazgo
//

import SwiftUI

struct ShopView: View {
    @State private var searchText = ""
    @State private var selectedCategory = "Të gjitha"
    let categories = ["Të gjitha", "Çanta", "Rripa", "Shalle", "Portofole", "Aksesore"]
    
    var body: some View {
        NavigationView {
            VStack {
                SearchBar(text: $searchText).padding(.horizontal)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(categories, id: \\.self) { category in
                            CategoryChip(title: category, isSelected: selectedCategory == category) {
                                selectedCategory = category
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 8)
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        ForEach(0..<8) { _ in
                            ProductGridItem()
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .navigationTitle("Dyqani")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass").foregroundColor(.secondary)
            TextField("Kërko produkte...", text: $text).textFieldStyle(.plain)
            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill").foregroundColor(.secondary)
                }
            }
        }
        .padding(10)
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }
}

struct CategoryChip: View {
    let title: String; let isSelected: Bool; let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(isSelected ? .semibold : .medium)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.blue : Color(.systemGray6))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
        }
    }
}

struct ProductGridItem: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray5))
                .aspectRatio(1, contentMode: .fit)
            Text("Produkti")
                .font(.subheadline)
                .fontWeight(.medium)
                .lineLimit(1)
            Text("€XX.XX")
                .font(.subheadline)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            Button("Shto") {
                // Add to cart
            }
            .buttonStyle(.bordered)
            .tint(.blue)
            .font(.caption)
            .frame(maxWidth: .infinity)
        }
        .padding(12)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
