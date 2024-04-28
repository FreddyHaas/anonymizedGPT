import customtkinter


class TextDisplay(customtkinter.CTkFrame):
    def __init__(self, master, title, text):
        super().__init__(master)

        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)

        self.label = customtkinter.CTkLabel(self, text=title).grid(row=0, column=0, sticky="w", padx=10, pady=2)
        self.textbox = customtkinter.CTkTextbox(master=self, corner_radius=6)
        self.textbox.grid(row=1, column=0, sticky="nsew")
        self.textbox.insert("0.0", text)
        self.textbox.configure(state="disabled")

