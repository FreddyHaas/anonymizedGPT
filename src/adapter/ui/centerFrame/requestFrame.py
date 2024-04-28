import customtkinter

import os
from PIL import Image

from src.adapter.ui.centerFrame.textDisplay import TextDisplay
from src.adapter.ui.centerFrame.textEntry import TextEntry
from src.adapter.ui.utils.collapseButton import CollapseButton
from src.application.AnonymizeTextUseCase import AnonymizeTextUseCase
from src.application.NotifySettingsChangeUseCase import NotifySettingsChangeUseCase
from src.application.SettingsChangeObserver import SettingsChangeObserver


class RequestFrame(customtkinter.CTkFrame, SettingsChangeObserver):
    def __init__(self, master, toggle_frame_size):
        super().__init__(master)
        self.toggle_frame_size = toggle_frame_size

        self.grid_rowconfigure(0, weight=0)
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(2, weight=1)
        self.collapsed = False

        self.collapseButton = CollapseButton(self, text="Anonymize", command=self.toggle_view, collapsed=self.collapsed)
        self.collapseButton.grid(row=0, column=0, columnspan=3, pady=2, padx=2, sticky="we")

        self.request = TextEntry(self, title="Input", text="Your input goes here...",
                                 on_text_input_change=self.update_anonymized_text)
        self.request.grid(row=1, column=0, padx=10, pady=10, sticky="nswe")

        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../../../assets/images")
        self.arrow = customtkinter.CTkImage(Image.open(os.path.join(image_path, "arrow-right.png")), size=(20, 20))
        self.arrow = customtkinter.CTkLabel(self, text="", image=self.arrow)
        self.arrow.grid(row=1, column=1)

        self.response = TextDisplay(self, title="Anonymized Text", text="Your output goes here...")
        self.response.configure(corner_radius=6)
        self.response.grid(row=1, column=2, padx=10, pady=10, sticky="nswe")

        self.settings = NotifySettingsChangeUseCase.get_instance()
        self.settings.subscribe(self)

    def toggle_view(self):
        if self.collapsed:
            self.request.grid(row=1, column=0, padx=10, pady=10, sticky="nswe")
            self.arrow.grid(row=1, column=1)
            self.response.grid(row=1, column=2, padx=10, pady=10, sticky="nswe")
            self.arrow.grid()
            self.grid_rowconfigure(1, weight=1)
            self.toggle_frame_size()

        else:
            self.response.grid_remove()
            self.arrow.grid_remove()
            self.request.grid_remove()
            self.grid_rowconfigure(1, weight=0)
            self.toggle_frame_size()
        self.collapsed = not self.collapsed

    def set_output_text(self, text):
        self.response.textbox.configure(state="normal")
        self.response.textbox.delete("0.0", "end")
        self.response.textbox.insert("0.0", text)
        self.response.textbox.configure(state="disabled")

    def update_anonymized_text(self):
        text = self.request.get_text()
        anonymized_text = AnonymizeTextUseCase.anonymize(text)
        self.set_output_text(anonymized_text)

    def on_settings_change(self) -> None:
        self.update_anonymized_text()
