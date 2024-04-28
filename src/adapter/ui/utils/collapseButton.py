import customtkinter

import os
from PIL import Image


class CollapseButton(customtkinter.CTkFrame):
    def __init__(self, master, text, command, collapsed):
        super().__init__(master)

        def on_click():
            if self.collapsed:
                self.icon.configure(image=self.image_down)
            else:
                self.icon.configure(image=self.image_up)
            self.collapsed = not self.collapsed
            command()

        self.configure(cursor="pointinghand")
        self.collapsed = collapsed

        self.text = customtkinter.CTkButton(self, text=text, fg_color="transparent", bg_color="transparent", hover=False, command=on_click, width=60)
        self.text.grid(row=0, column=0, padx=5, pady=2, sticky="w")

        self.grid_columnconfigure(0, weight=1)

        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../../../assets/images")
        self.image_down = customtkinter.CTkImage(Image.open(os.path.join(image_path, "arrow-down.png")),
                                                 size=(12, 12))
        self.image_up = customtkinter.CTkImage(Image.open(os.path.join(image_path, "arrow-up.png")),
                                               size=(12, 12))

        self.icon = customtkinter.CTkButton(self, image=self.image_down, text="", fg_color="transparent", bg_color="transparent", hover=False, command=on_click, width=30)
        self.icon.grid(row=0, column=1, padx=5, pady=2, sticky="e")

        self.bind("<Button-1>", lambda event: on_click())

