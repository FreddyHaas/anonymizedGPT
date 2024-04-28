import customtkinter

from src.adapter.ui.sideBar.listFrame.listFrame import ListFrame
from src.adapter.ui.sideBar.standardSettings.standardSettingsFrame import StandardSettingsFrame


class SideBarFrame(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        self.label = customtkinter.CTkLabel(self, text="What to anonymize?", width=160)
        self.label.grid(row=0, column=0, padx=10, pady=5, sticky="we")

        self.standardSettings = StandardSettingsFrame(self)
        self.standardSettings.grid(row=1, column=0, pady=5, padx=5, sticky="we")

        self.allowList = ListFrame(self, "Allow list")
        self.allowList.grid(row=2, column=0, pady=5, padx=5, sticky="we")

        self.denyList = ListFrame(self, "Deny list", deny_list=True)
        self.denyList.grid(row=3, column=0, pady=5, padx=5, sticky="we")


