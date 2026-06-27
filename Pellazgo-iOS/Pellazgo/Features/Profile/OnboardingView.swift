//
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
