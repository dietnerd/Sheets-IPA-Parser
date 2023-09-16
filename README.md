# Google Sheets compatible IPA / Graph Phoneme Counter
Google sheets function dedicated toward creating a generalized count of all phonemes / graphs used in a given input!

## How to Install

In a Google Sheets document, copy the code contained in GraphIPA.gs into a custom Apps script. To do so, go into Extensions > Apps Script.

![Where to find the Apps script repository](https://github.com/dietnerd/Sheets-IPA-Parser/assets/15204355/8d214ad1-d44a-4cb9-ba7a-2b6ff0d7cfb7)

Copy the GraphIPA.gs code into a GS file, save and you should be good to go!

## How to Use 

Both GRAPHCOUNT and IPACOUNT take the same inputs and have the same output, and should be used in a sheet as follows: 
```
=GRAPHCOUNT({word range}, {phonemes}, ...)
=IPACOUNT({word range}, {phonemes}, ...)
```

* **{word range}** - this input should be a range of all the words you wish to analyze. The code will automatically ignore blank cells.
* **{phonemes}** - this input should be a range of all phonemes / graphs that you wish to count through. This can be provided over multiple different ranges in cases where, say, you have a really nicely formatted IPA chart and you don't want to have to copy everyting over.

![Pretty, pretty IPA chart](https://github.com/dietnerd/Sheets-IPA-Parser/assets/15204355/8b5d21bf-84d7-4ce1-bd50-ba7bc205ea07)
 
Once this is done, the function will output a table of phonemes / graphs and the number of times it appears throughout the word range.

![Example output](https://github.com/dietnerd/Sheets-IPA-Parser/assets/15204355/14e8128d-18b1-4811-9f1a-52b46e93a692)

### GRAPHCOUNT

This function has the highest level of flexibility with input phonemes, and can take any multi-graph input. This should also take non-unicode characters, so if you wanted to count, say, Hangul characters or Chinese logographs, it will give the number of occurrences of those characters.
 
[!NOTE]
There is an upper limit on multi-graph length and it will not parse multi-graphs greater than 10 characters. This also includes any diacritics added, so `ě̤` is technically 3 characters and `ḁ̝̼̄̌̂̃᷅̏` is 10. But why would you need more than 10?

### IPACOUNT

This function is dedicated with the idea that the input phonemes are explicitly IPA characters, and as such phoneme input like "sch" will not be counted. The speed of this function is relatively quicker[^1] due to the optimizations, which is why it has its own dedicated input.

[1] Not actually tested, this is general regex theory

## Common Questions

* **Can this code be used in an Excel document?**
Excel does allow for custom code to be loaded, and this script is technically written in a Google-flavored Javascript so its hypothetically possible. This is untested though.

* **Will this script auto-generate cool phoneme distribution charts?**
Currently there are no plans to do so, but it is theoretically possible. If enough folks ask I might do so.

* **Why is it counting é and é as two different phonemes??**
tl;dr they're typed differently.

In a slightly longer explanation: there are two ways that diacritics like the acute accent can be added to a letter. The first is by typing the direct unicode character that naturally contains the accent (only really available with letters that commonly have a diacritic, such as ñ) OR a letter can be combined with a diacritic, such as '◌́ '. This can allow for more unique diacritic combinations and can potentially be endlessly combined to create n̉ͣ̓͏̗̮̙̹͕͉͉ͅo̤̬̜̱̯̱ͦͨ̅̈͠n̓̔̀ş̫̪̯̠͎͎͂̓̍e̛̍͂n̓ͪ̊͛͏̮̪s̛̄e̶̤̻ͥ͆.

The code currently doesn't distinguish between the (technically two-character) letter-diacritic combo and the direct unicode character, so be aware that they will be considered separate.
