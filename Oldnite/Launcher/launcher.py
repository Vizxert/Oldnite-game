#!/usr/bin/env python3
"""
Fortnite Season 7.00 Launcher
Launches Fortnite with custom backend arguments for private server
"""

import os
import sys
import subprocess
import json
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import threading
import time

class FortniteLauncher:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Fortnite Season 7.00 Launcher")
        self.root.geometry("600x500")
        self.root.resizable(False, False)
        
        # Default configuration
        self.config = {
            "fortnite_path": "",
            "backend_url": "http://127.0.0.1:3551",
            "username": "Player",
            "custom_args": []
        }
        
        self.load_config()
        self.create_ui()
        
    def load_config(self):
        """Load configuration from config.json"""
        config_path = os.path.join(os.path.dirname(__file__), "config.json")
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    self.config.update(json.load(f))
            except Exception as e:
                print(f"Error loading config: {e}")
    
    def save_config(self):
        """Save configuration to config.json"""
        config_path = os.path.join(os.path.dirname(__file__), "config.json")
        try:
            with open(config_path, 'w') as f:
                json.dump(self.config, f, indent=4)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save config: {e}")
    
    def create_ui(self):
        """Create the launcher UI"""
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Fortnite Season 7.00 Launcher", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Fortnite Path
        ttk.Label(main_frame, text="Fortnite Executable:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.path_var = tk.StringVar(value=self.config["fortnite_path"])
        path_entry = ttk.Entry(main_frame, textvariable=self.path_var, width=50)
        path_entry.grid(row=1, column=1, padx=(5, 5), pady=5)
        ttk.Button(main_frame, text="Browse", command=self.browse_fortnite).grid(row=1, column=2, pady=5)
        
        # Backend URL
        ttk.Label(main_frame, text="Backend URL:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.backend_var = tk.StringVar(value=self.config["backend_url"])
        ttk.Entry(main_frame, textvariable=self.backend_var, width=50).grid(row=2, column=1, columnspan=2, padx=(5, 0), pady=5)
        
        # Username
        ttk.Label(main_frame, text="Username:").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.username_var = tk.StringVar(value=self.config["username"])
        ttk.Entry(main_frame, textvariable=self.username_var, width=50).grid(row=3, column=1, columnspan=2, padx=(5, 0), pady=5)
        
        # Launch Arguments
        ttk.Label(main_frame, text="Launch Arguments:").grid(row=4, column=0, sticky=tk.W, pady=5)
        args_frame = ttk.Frame(main_frame)
        args_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        self.args_text = tk.Text(args_frame, height=8, width=70)
        scrollbar = ttk.Scrollbar(args_frame, orient=tk.VERTICAL, command=self.args_text.yview)
        self.args_text.configure(yscrollcommand=scrollbar.set)
        
        self.args_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        # Default arguments for Season 7.00
        default_args = self.get_default_args()
        self.args_text.insert(tk.END, "\n".join(default_args))
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=6, column=0, columnspan=3, pady=20)
        
        ttk.Button(button_frame, text="Launch Fortnite", command=self.launch_fortnite, 
                  style="Accent.TButton").pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Start Backend", command=self.start_backend).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Save Config", command=self.save_settings).pack(side=tk.LEFT, padx=5)
        
        # Status
        self.status_var = tk.StringVar(value="Ready")
        status_label = ttk.Label(main_frame, textvariable=self.status_var, foreground="green")
        status_label.grid(row=7, column=0, columnspan=3, pady=10)
        
    def get_default_args(self):
        """Get default launch arguments for Season 7.00"""
        return [
            "-AUTH_LOGIN=unused",
            "-AUTH_PASSWORD=unused", 
            "-AUTH_TYPE=epic",
            "-epicapp=Fortnite",
            "-epicenv=Prod",
            "-EpicPortal",
            "-skippatchcheck",
            "-nobe",
            "-fromfl=eac",
            "-fltoken=3db3ba5dcbd2e16703f3978d",
            "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9",
            f"-epiclocale=en",
            "-nosslpinning",
            "-log"
        ]
    
    def browse_fortnite(self):
        """Browse for Fortnite executable"""
        filename = filedialog.askopenfilename(
            title="Select Fortnite Executable",
            filetypes=[("Executable files", "*.exe"), ("All files", "*.*")]
        )
        if filename:
            self.path_var.set(filename)
    
    def save_settings(self):
        """Save current settings"""
        self.config["fortnite_path"] = self.path_var.get()
        self.config["backend_url"] = self.backend_var.get()
        self.config["username"] = self.username_var.get()
        self.config["custom_args"] = self.args_text.get("1.0", tk.END).strip().split("\n")
        
        self.save_config()
        self.status_var.set("Configuration saved!")
        self.root.after(3000, lambda: self.status_var.set("Ready"))
    
    def start_backend(self):
        """Start the backend server"""
        def run_backend():
            try:
                backend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Backend")
                if os.path.exists(os.path.join(backend_path, "server.js")):
                    subprocess.Popen(["node", "server.js"], cwd=backend_path, shell=True)
                    self.status_var.set("Backend server started!")
                else:
                    self.status_var.set("Backend server not found!")
            except Exception as e:
                self.status_var.set(f"Error starting backend: {e}")
        
        threading.Thread(target=run_backend, daemon=True).start()
    
    def launch_fortnite(self):
        """Launch Fortnite with custom arguments"""
        fortnite_path = self.path_var.get()
        
        if not fortnite_path or not os.path.exists(fortnite_path):
            messagebox.showerror("Error", "Please select a valid Fortnite executable!")
            return
        
        # Get launch arguments
        args = self.args_text.get("1.0", tk.END).strip().split("\n")
        args = [arg.strip() for arg in args if arg.strip()]
        
        # Add backend URL argument
        backend_url = self.backend_var.get()
        args.append(f"-epicbackend={backend_url}")
        
        # Add SSL bypass arguments for libcurl
        args.extend([
            "-NOSSLPINNING",
            "-NOSSLFAIL", 
            "-INSECURE",
            "-ALLOWINSECURECONNECTIONS"
        ])
        
        try:
            # Launch Fortnite
            cmd = [fortnite_path] + args
            subprocess.Popen(cmd)
            
            self.status_var.set("Fortnite launched successfully!")
            messagebox.showinfo("Success", "Fortnite has been launched with Season 7.00 configuration!")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to launch Fortnite: {e}")
            self.status_var.set("Launch failed!")
    
    def run(self):
        """Run the launcher"""
        self.root.mainloop()

if __name__ == "__main__":
    launcher = FortniteLauncher()
    launcher.run()
