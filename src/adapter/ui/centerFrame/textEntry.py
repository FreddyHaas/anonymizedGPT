import customtkinter


class TextEntry(customtkinter.CTkFrame):
    def __init__(self, master, title: str, text: str, on_text_input_change):
        super().__init__(master)
        self.on_text_input_change = on_text_input_change

        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)

        self.label = customtkinter.CTkLabel(self, text=title, fg_color="transparent", bg_color="transparent")
        self.label.grid(row=0, column=0, sticky="w", padx=10, pady=2)

        self.textbox = customtkinter.CTkTextbox(master=self, corner_radius=6)
        self.textbox.grid(row=1, column=0, sticky="nsew")
        self.textbox.insert("0.0", text)
        self.textbox.configure(border_color="#1D1E1E", border_width=1)

        self.textbox.bind("<FocusIn>", self.on_focus_in)
        self.textbox.bind("<FocusOut>", self.on_focus_out)

    def on_focus_in(self, event) -> None:
        self.textbox.configure(border_color="green")

    def on_focus_out(self, event) -> None:
        self.textbox.configure(border_color="#1D1E1E")
        self.on_text_input_change()

    def get_text(self) -> str:
        return self.textbox.get("1.0", "end")