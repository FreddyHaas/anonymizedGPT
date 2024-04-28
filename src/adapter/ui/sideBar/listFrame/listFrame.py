import customtkinter

from src.adapter.ui.sideBar.listFrame.textInput import TextInput
from src.adapter.ui.utils.collapseButton import CollapseButton


class ListFrame(customtkinter.CTkFrame):
    def __init__(self, master, text, deny_list=False):
        super().__init__(master)

        self.collapsed = False
        self.grid_columnconfigure(0, weight=1)

        self.list = TextInput(self, deny_list=deny_list)
        self.list.grid(row=1, column=0, padx=2, pady=2, sticky="nswe")

        self.collapseButton = CollapseButton(self, text=text, command=self.toggle_view, collapsed=self.collapsed)
        self.collapseButton.grid(row=0, column=0, pady=2, padx=2, sticky="we")

    def toggle_view(self):
        if self.collapsed:
            self.list.grid(row=1, column=0, padx=2, pady=2, sticky="nswe")
        else:
            self.list.grid_remove()
        self.collapsed = not self.collapsed
