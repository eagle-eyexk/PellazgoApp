#!/usr/bin/env python3
"""
Pellazgo iOS Auto‑Builder — Pure Python
Clones repo, generates Swift code, installs pods, opens Xcode.
"""

import os
import json
import shutil
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# ============================================================
# CONFIGURATION
# ============================================================

CONFIG = {
    "app_name": "Pellazgo",
    "bundle_id": "com.pellazgo.app",
    "repo_url": "https://github.com/eagle-eyexk/PellazgoApp.git",
    "output_dir": "Pellazgo-iOS",
    "team_id": "H4QUDPK7S3",
}

# ============================================================
# PHASE 1: REPOSITORY EXTRACTION
# ============================================================

def clone_repository():
    repo_dir = Path("PellazgoApp_repo")
    if repo_dir.exists():
        print("📦 Repository exists, pulling latest...")
        subprocess.run(["git", "-C", str(repo_dir), "pull"], check=False)
    else:
        print("📦 Cloning repository...")
        subprocess.run(["git", "clone", CONFIG["repo_url"], str(repo_dir)], check=True)
    return repo_dir

# ============================================================
# PHASE 2: GENERATE IOS STRUCTURE & SWIFT FILES
# ============================================================

def generate_ios_structure():
    ios_dir = Path(CONFIG["output_dir"])
    ios_dir.mkdir(parents=True, exist_ok=True)
    dirs = [
        "Pellazgo/App",
        "Pellazgo/Features/Home",
        "Pellazgo/Features/Shop",
        "Pellazgo/Features/Product",
        "Pellazgo/Features/Cart",
        "Pellazgo/Features/Profile",
        "Pellazgo/Features/Checkout",
        "Pellazgo/Core/Networking",
        "Pellazgo/Core/Models",
        "Pellazgo/Core/Services",
        "Pellazgo/Core/Storage",
        "Pellazgo/Core/Authentication",
        "Pellazgo/Resources/Assets.xcassets",
        "Pellazgo/Resources/Assets.xcassets/AppIcon.appiconset",
        "Pellazgo/Resources/Assets.xcassets/AccentColor.colorset",
        "Pellazgo/Resources/Base.lproj",
    ]
    for d in dirs:
        (ios_dir / d).mkdir(parents=True, exist_ok=True)
    return ios_dir

def generate_app_entry(ios_dir):
    content = '''//
//  PellazgoApp.swift
//  Pellazgo
//

import SwiftUI
import FirebaseCore
import FirebaseAuth
import Stripe

@main
struct PellazgoApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(.light)
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        StripeAPI.defaultPublishableKey = ProcessInfo.processInfo.environment["STRIPE_PUBLISHABLE_KEY"] ?? "pk_test_..."
        return true
    }
}

class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    
    init() {
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.isAuthenticated = user != nil
            if let user = user {
                self?.fetchUser(uid: user.uid)
            }
        }
    }
    
    private func fetchUser(uid: String) {
        let db = Firestore.firestore()
        db.collection("users").document(uid).getDocument { [weak self] snapshot, error in
            if let data = snapshot?.data() {
                self?.currentUser = User(id: uid, data: data)
            }
        }
    }
}
struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        if appState.isLoading {
            ProgressView().scaleEffect(1.5)

        } else if appState.isAuthenticated {
            MainTabView()
        } else {
            OnboardingView()
        }
    }
}
'''

    (ios_dir / "Pellazgo/App/PellazgoApp.swift").write_text(content)
    print("✅ PellazgoApp.swift")

def generate_main_tab_view(ios_dir):
    content = '''//

//  MainTabView.swift
//  Pellazgo
//

import SwiftUI


struct MainTabView: View {
    @State private var selectedTab = 0
    @StateObject private var cartViewModel = CartViewModel()

    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()

                .tabItem {
                    Label("Kryefaqja", systemImage: "house.fill")
                }
                .tag(0)
            ShopView()
                .tabItem {
                    Label("Dyqani", systemImage: "bag.fill")

                }
                .tag(1)
            CartView()
                .tabItem {
                    Label("Shporta", systemImage: "cart.fill")
                }
                .badge(cartViewModel.itemCount)
                .tag(2)
            ProfileView()
                .tabItem {
                    Label("Profili", systemImage: "person.fill")
                }
                .tag(3)
        }
        .accentColor(Color("AccentColor"))
        .environmentObject(cartViewModel)
    }
}
'''
    (ios_dir / "Pellazgo/Features/Home/MainTabView.swift").write_text(content)
    print("✅ MainTabView.swift")

def generate_home_view(ios_dir):
    content = '''//
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
                    Text("€\\(product.originalPrice, specifier: \"%.2f\")")
                        .font(.caption)
                        .strikethrough()
                        .foregroundColor(.secondary)
                }
                Text("€\\(product.price, specifier: \"%.2f\")")
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
            Text("\\(name), \\(location)")
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
'''
    (ios_dir / "Pellazgo/Features/Home/HomeView.swift").write_text(content)
    print("✅ HomeView.swift")

def generate_shop_view(ios_dir):
    content = '''//
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
'''
    (ios_dir / "Pellazgo/Features/Shop/ShopView.swift").write_text(content)
    print("✅ ShopView.swift")

def generate_cart_view(ios_dir):
    content = '''//
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
                Text("€\\(item.price, specifier: \"%.2f\")")
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                HStack {
                    Button(action: { /* Decrease */ }) { Image(systemName: "minus.circle") }
                    Text("\\(item.quantity)").font(.subheadline).frame(minWidth: 30)
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
'''
    (ios_dir / "Pellazgo/Features/Cart/CartView.swift").write_text(content)
    print("✅ CartView.swift")

def generate_profile_view(ios_dir):
    content = '''//
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
'''
    (ios_dir / "Pellazgo/Features/Profile/ProfileView.swift").write_text(content)
    print("✅ ProfileView.swift")

def generate_checkout_view(ios_dir):
    content = '''//
//  CheckoutView.swift
//  Pellazgo
//

import SwiftUI
import Stripe

struct CheckoutView: View {
    @Environment(\\.dismiss) var dismiss
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
'''
    (ios_dir / "Pellazgo/Features/Checkout/CheckoutView.swift").write_text(content)
    print("✅ CheckoutView.swift")

def generate_onboarding_view(ios_dir):
    content = '''//
//  OnboardingView.swift
//  Pellazgo
//

import SwiftUI
import FirebaseAuth
import AuthenticationServices

struct OnboardingView: View {
    @State private var isLoginMode = true
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""
    @State private var isLoading = false
    @State private var errorMessage = ""
    @State private var showError = false
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    VStack(spacing: 8) {
                        Image("logo")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 120, height: 120)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.blue, lineWidth: 2))
                        Text("Pellazgo").font(.largeTitle).fontWeight(.bold)
                        Text("Elegancë e Përjetshme").font(.subheadline).foregroundColor(.secondary)
                    }
                    .padding(.top, 40)
                    
                    VStack(spacing: 16) {
                        if !isLoginMode {
                            TextField("Emri i plotë", text: $name)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .autocapitalization(.words)
                        }
                        TextField("Email", text: $email)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                            .keyboardType(.emailAddress)
                        SecureField("Fjalëkalimi", text: $password)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        if showError {
                            Text(errorMessage).font(.caption).foregroundColor(.red)
                        }
                        Button {
                            Task { await handleAuth() }
                        } label: {
                            if isLoading {
                                ProgressView().tint(.white)
                            } else {
                                Text(isLoginMode ? "Hyni" : "Regjistrohu")
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .disabled(isLoading)
                        
                        Button {
                            isLoginMode.toggle()
                            errorMessage = ""
                            showError = false
                        } label: {
                            Text(isLoginMode ? "Nuk keni llogari? Regjistrohuni" : "Keni llogari? Hyni")
                                .font(.footnote)
                                .foregroundColor(.blue)
                        }
                        
                        Divider().padding(.vertical, 8)
                        
                        VStack(spacing: 12) {
                            SignInWithAppleButton(
                                onRequest: { request in
                                    request.requestedScopes = [.fullName, .email]
                                },
                                onCompletion: { _ in }
                            )
                            .signInWithAppleButtonStyle(.black)
                            .frame(height: 50)
                            .cornerRadius(12)
                            
                            Button {
                                // Google Sign In
                            } label: {
                                HStack {
                                    Image("google")
                                        .resizable()
                                        .frame(width: 20, height: 20)
                                    Text("Vazhdo me Google")
                                        .fontWeight(.medium)
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color(.systemGray6))
                                .foregroundColor(.primary)
                                .cornerRadius(12)
                            }
                        }
                    }
                    .padding(.horizontal, 24)
                    Spacer()
                }
                .padding(.bottom, 40)
            }
            .navigationBarHidden(true)
            .background(Color(.systemBackground))
        }
    }
    
    private func handleAuth() async {
        isLoading = true
        showError = false
        do {
            if isLoginMode {
                let result = try await Auth.auth().signIn(withEmail: email, password: password)
                appState.isAuthenticated = true
            } else {
                let result = try await Auth.auth().createUser(withEmail: email, password: password)
                appState.isAuthenticated = true
            }
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }
        isLoading = false
    }
}
'''
    (ios_dir / "Pellazgo/Features/Profile/OnboardingView.swift").write_text(content)
    print("✅ OnboardingView.swift")

# ============================================================
# PHASE 4: GENERATE CONFIGURATION FILES
# ============================================================

def generate_info_plist(ios_dir):
    content = '''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>com.pellazgo.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <false/>
        <key>UISceneConfigurations</key>
        <dict>
            <key>UIWindowSceneSessionRoleApplication</key>
            <array>
                <dict>
                    <key>UISceneClassName</key>
                    <string>UIWindowScene</string>
                    <key>UISceneDelegateClassName</key>
                    <string>SceneDelegate</string>
                </dict>
            </array>
        </dict>
    </dict>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Pellazgo përdor fotot për të shfaqur produktet dhe për të lejuar klientët të ruajnë imazhe të produkteve të tyre të preferuara.</string>
    <key>NSCameraUsageDescription</key>
    <string>Pellazgo përdor kamerën për të lejuar klientët të skanojnë kodet e produktit dhe të ngarkojnë fotografi për rishikime.</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Pellazgo përdor lokacionin për të llogaritur kostot e transportit dhe për të ofruar shërbime më të mira të dorëzimit.</string>
</dict>
</plist>'''
    (ios_dir / "Pellazgo/Info.plist").write_text(content)
    print("✅ Info.plist")

def generate_export_options(ios_dir):
    content = '''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>destination</key>
    <string>export</string>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>H4QUDPK7S3</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
    <key>provisioningProfiles</key>
    <dict>
        <key>com.pellazgo.app</key>
        <string>Pellazgo_App_Store</string>
    </dict>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
    <key>manageAppVersionAndBuildNumber</key>
    <true/>
</dict>
</plist>'''
    (ios_dir / "Pellazgo/exportOptions.plist").write_text(content)
    print("✅ exportOptions.plist")

def generate_podfile(ios_dir):
    content = '''platform :ios, '15.0'
use_frameworks!

target 'Pellazgo' do
  pod 'FirebaseCore'
  pod 'FirebaseAuth'
  pod 'FirebaseFirestore'
  pod 'FirebaseStorage'
  pod 'FirebaseCrashlytics'
  pod 'FirebaseAnalytics'
  pod 'Stripe'
  pod 'StripeApplePay'
  pod 'SDWebImageSwiftUI'
  pod 'Kingfisher'
  pod 'Alamofire'
  pod 'GoogleSignIn'
  pod 'Mixpanel'

  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.0'
        config.build_settings['ENABLE_BITCODE'] = 'NO'
      end
    end
  end
end'''
    (ios_dir / "Podfile").write_text(content)
    print("✅ Podfile")

def generate_codemagic_yaml(ios_dir):
    content = '''workflows:
  ios-release:
    name: Pellazgo iOS Release
    max_build_duration: 60
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: pellazgo_asc
    environment:
      node: 18
      xcode: latest
      cocoapods: default
      vars:
        BUNDLE_ID: "com.pellazgo.app"
        APP_NAME: "Pellazgo"
        XCODE_WORKSPACE: "Pellazgo.xcworkspace"
        XCODE_SCHEME: "Pellazgo"
      groups:
        - code-signing
    triggering:
      events: [push]
      branch_patterns:
        - pattern: main
    scripts:
      - name: Install and build web app
        script: |
          npm ci --prefer-offline
          npm run build
      - name: Sync Capacitor and install pods
        script: |
          if [ ! -d "ios" ]; then npx cap add ios; fi
          npx cap sync ios
          cd ios/App && pod install --repo-update && cd ../..
      - name: Install provisioning profile
        script: |
          mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles
          cp signing/*.mobileprovision ~/Library/MobileDevice/Provisioning\\ Profiles/
      - name: Install certificate
        script: |
          security create-keychain -p build123 build.keychain
          security default-keychain -s build.keychain
          security unlock-keychain -p build123 build.keychain
          security import signing/distribution.cer -k build.keychain -A
          security import signing/pellazgo_distribution.key -k build.keychain -A
          security set-keychain-settings -t 3600 -l ~/Library/Keychains/build.keychain
    artifacts:
      - $CM_BUILD_DIR/build/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        submit_to_app_store: false
      email:
        recipients:
          - $USER_EMAIL
        notify_on_success: true
        notify_on_failure: true'''
    (ios_dir / "codemagic.yaml").write_text(content)
    print("✅ codemagic.yaml")

def generate_readme(ios_dir):
    content = """# Pellazgo iOS App

## 👜 Elegancë e Përjetshme

Pellazgo është një aplikacion luksoz për produkte lëkure të punuara me dorë, duke sjellë trashëgiminë shqiptare në botën moderne.

## ✨ Features

- **Koleksione Ekskluzive**: Çanta, rripa, shalle dhe portofole lëkure
- **Shportë dhe Porosi**: Sistem i plotë i porositjes
- **Pagesa e Sigurt**: Integrim me Stripe
- **Gjurmimi i Porosisë**: Në kohë reale
- **Artizanat Shqiptar**: Produkte të punuara me dorë

## 📱 Technology Stack

- **Frontend**: React + Vite + TypeScript
- **Mobile**: Capacitor 7 (iOS + Android)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Stripe
- **State Management**: TanStack Query
- **UI**: Tailwind CSS + Radix UI

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/eagle-eyexk/PellazgoApp.git

# Install dependencies
npm install

# Run web app
npm run dev

# Build for iOS
npm run build
npx cap sync ios
cd ios/App && pod install
