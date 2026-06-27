//
//  HomeView.swift
//  Pellazgo
//

import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @EnvironmentObject var cartViewModel: CartViewModel
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HeroBanner()
                    BrandStorySection()
                    CollectionsSection()
                    FeaturedProductsSection()
                    TestimonialsSection()
                }
                .padding(.bottom, 20)
            }
            .navigationTitle("Pellazgo")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {}) {
                        Image(systemName: "person.circle")
                            .font(.title2)
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadData()
        }
    }
}

struct HeroBanner: View {
    var body: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: 16)
                .fill(LinearGradient(
                    gradient: Gradient(colors: [Color(red: 0.1, green: 0.1, blue: 0.15), Color(red: 0.2, green: 0.15, blue: 0.25)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ))
                .frame(height: 200)
            VStack(alignment: .leading, spacing: 8) {
                Text("Koleksioni Ekskluziv 2025")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                Text("Elegancë e Përjetshme")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.8))
                Text("Trashëgimi Shqiptare, Artizanat Bashkëkohor")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.6))
                Button("Shiko të Gjitha") {
                    // Navigate
                }
                .buttonStyle(.borderedProminent)
                .tint(.white)
                .foregroundColor(.black)
                .padding(.top, 4)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 20)
        }
        .padding(.horizontal)
    }
}

struct BrandStorySection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Historia Jonë")
                .font(.title2)
                .fontWeight(.semibold)
                .padding(.horizontal)
            VStack(alignment: .leading, spacing: 8) {
                Text("Artizanat që Rrëfen Histori")
                    .font(.headline)
                    .foregroundColor(.primary)
                Text("Pellazgo lindi nga pasioni për artizanatin shqiptar dhe dëshira për të sjellë elegancën e trashëgimisë sonë në botën moderne.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .lineSpacing(4)
                HStack(spacing: 20) {
                    StatItem(value: "15+", label: "Vite Eksperiencë")
                    StatItem(value: "2K+", label: "Klientë të Kënaqur")
                    StatItem(value: "100%", label: "Lëkurë Origjinale")
                }
                .padding(.top, 8)
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }
}

struct StatItem: View {
    let value: String
    let label: String
    var body: some View {
        VStack(spacing: 2) {
            Text(value).font(.title3).fontWeight(.bold)
            Text(label).font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

struct CollectionsSection: View {
    let collections = [
        ("Aksesore Premium", "bag"),
        ("Koleksioni Lëkurës", "leather"),
        ("Edicioni i Kufizuar", "star")
    ]
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Koleksionet Tona")
                .font(.title2)
                .fontWeight(.semibold)
                .padding(.horizontal)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(collections, id: \\.0) { collection in
                        CollectionCard(title: collection.0, icon: collection.1)
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}

struct CollectionCard: View {
    let title: String
    let icon: String
    var body: some View {
        VStack {
            Image(systemName: icon)
                .font(.largeTitle)
                .foregroundColor(.white)
                .frame(width: 60, height: 60)
                .background(Color.blue.opacity(0.8))
                .clipShape(Circle())
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
        }
        .frame(width: 100)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct FeaturedProductsSection: View {
    @StateObject private var viewModel = HomeViewModel()
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Të Zgjedhura")
                    .font(.title2)
                    .fontWeight(.semibold)
                Spacer()
                Button("Shiko të Gjitha") {
                    // Navigate
                }
                .font(.subheadline)
                .foregroundColor(.blue)
            }
            .padding(.horizontal)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(viewModel.featuredProducts) { product in
                        ProductCard(product: product)
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}

struct ProductCard: View {
    let product: Product
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray5))
                .frame(width: 160, height: 160)
                .overlay(
                    VStack {
                        if product.isNew {
                            Text("NEW")
                                .font(.caption2)
                                .fontWeight(.bold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(4)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(8)
                        }
                        Spacer()
                    }
                )
            Text(product.name)
                .font(.subheadline)
                .fontWeight(.medium)
                .lineLimit(1)
            HStack(spacing: 4) {
                if product.hasDiscount {
                    Text("€\(product.originalPrice, specifier: "%.2f")")
                        .font(.caption)
                        .strikethrough()
                        .foregroundColor(.secondary)
                }
                Text("€\(product.price, specifier: "%.2f")")
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(product.hasDiscount ? .red : .primary)
            }
            Button("Shto në Shportë") {
                // Add to cart
            }
            .buttonStyle(.bordered)
            .tint(.blue)
            .font(.caption)
            .frame(maxWidth: .infinity)
        }
        .frame(width: 160)
        .padding(12)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct TestimonialsSection: View {
    let testimonials = [
        ("A Arjeta M.", "Tiranë", "Cilësia e produkteve të Pellazgo është e jashtëzakonshme. Çanta ime e lëkurës duket akoma si e re pas dy vjetësh."),
        ("B Besnik K.", "Prishtinë", "Shërbimi i klientit është i shkëlqyer. Porositë arrijnë gjithmonë në kohë dhe paketimi është i mrekullueshëm."),
        ("D Dorina L.", "Durrës", "Pellazgo përfaqëson vërtet artizanatin shqiptar në nivelin më të lartë. Jam krenare që mbështes këtë markë.")
    ]
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Çfarë Thonë Klientët Tanë")
                .font(.title2)
                .fontWeight(.semibold)
                .padding(.horizontal)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(testimonials, id: \\.0) { testimonial in
                        TestimonialCard(name: testimonial.0, location: testimonial.1, text: testimonial.2)
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}

struct TestimonialCard: View {
    let name: String; let location: String; let text: String
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("⭐").font(.title3)
                Text("⭐").font(.title3)
                Text("⭐").font(.title3)
                Text("⭐").font(.title3)
                Text("⭐").font(.title3)
            }
            Text(text)
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(3)
            Text("\(name), \(location)")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.primary)
        }
        .padding()
        .frame(width: 280)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

class HomeViewModel: ObservableObject {
    @Published var featuredProducts: [Product] = []
    @Published var isLoading = false
    func loadData() {
        isLoading = true
        featuredProducts = [
            Product(id: "1", name: "Çanta Messenger Cognac", price: 189.00, originalPrice: 189.00, isNew: true, hasDiscount: false),
            Product(id: "2", name: "Rrip Lëkure Espresso", price: 59.00, originalPrice: 79.00, isNew: false, hasDiscount: true),
            Product(id: "3", name: "Shall Mëndafshi Bordo", price: 129.00, originalPrice: 129.00, isNew: true, hasDiscount: false),
            Product(id: "4", name: "Portofol Lëkure Obsidian", price: 69.00, originalPrice: 89.00, isNew: false, hasDiscount: true),
        ]
        isLoading = false
    }
}

struct Product: Identifiable {
    let id: String
    let name: String
    let price: Double
    let originalPrice: Double
    let isNew: Bool
    let hasDiscount: Bool
}

class CartViewModel: ObservableObject {
    @Published var items: [CartItem] = []
    @Published var itemCount: Int = 0
}
