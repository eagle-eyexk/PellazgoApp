//
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
