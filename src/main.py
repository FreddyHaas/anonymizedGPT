import customtkinter

from src.adapter.ui.centerFrame.centerFrame import CenterFrame
from src.adapter.ui.sideBar.sideBarFrame import SideBarFrame

class App(customtkinter.CTk):
    def __init__(self):
        super().__init__()

        self.title("Anonymized AI")
        self.geometry("800x600")
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        customtkinter.set_default_color_theme("green")

        self.sideBarFrame = SideBarFrame(self)
        self.sideBarFrame.grid(row=0, column=0, padx=10, pady=10, sticky="nswe")

        self.centerFrame = CenterFrame(self)
        self.centerFrame.grid(row=0, column=1, padx=10, pady=10, sticky="nswe")


app = App()
app.bind_all("<Button-1>", lambda event: event.widget.focus_set())
app.mainloop()
