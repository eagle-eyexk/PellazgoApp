//
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
