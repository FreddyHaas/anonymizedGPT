import customtkinter

from src.adapter.ui.sideBar.standardSettings.standardSettingsOptions import StandardSettingsOptions
from src.adapter.ui.utils.collapseButton import CollapseButton


class StandardSettingsFrame(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        self.collapsed = False
        self.grid_columnconfigure(0, weight=1)

        def toggle_view():
            if self.collapsed:
                self.options.grid(row=1, column=0, padx=2, pady=2, sticky="nswe")
            else:
                self.options.grid_remove()
            self.collapsed = not self.collapsed

        self.options = StandardSettingsOptions(self)
        self.options.grid(row=1, column=0, padx=2, pady=2, sticky="nswe")

        self.collapseButton = CollapseButton(self, text="Standard entities", command=toggle_view, collapsed=self.collapsed)
        self.collapseButton.grid(row=0, column=0, pady=2, padx=2, sticky="we")

