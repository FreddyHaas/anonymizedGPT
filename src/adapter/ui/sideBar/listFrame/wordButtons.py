import tkinter

import customtkinter
import os
from PIL import Image


class WordButtons(tkinter.Frame):
    def __init__(self, master, list_of_words, remove_word, deny_list=False):
        super().__init__(master)

        icon_folder_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../../../../assets/images")
        self.icon = customtkinter.CTkImage(Image.open(os.path.join(icon_folder_path, "cancel.png")), size=(12, 12))

        for i, word in enumerate(list_of_words):
            if deny_list is True:
                (customtkinter.CTkButton(self, text=word, image=self.icon,
                                         compound="right", command=lambda w=word: remove_word(w), fg_color="#E06666",
                                         hover_color="#d53c3c")
                 .grid(row=i, column=0, pady=5, padx=0, sticky="w"))

            else:
                (customtkinter.CTkButton(self, text=word, image=self.icon,
                                         compound="right", command=lambda w=word: remove_word(w))
                 .grid(row=i, column=0, pady=5, padx=0, sticky="w"))
