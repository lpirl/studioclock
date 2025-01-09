Clone of the wonderful `studio clock Chrome app
<https://chrome.google.com/webstore/detail/studio-clock/eclcdfoccndncapnfnellpcoidmjhckn>`__
(`repository <https://github.com/oskar456/studioclock.git>`__)
by `Ondřej Caletka <https://github.com/oskar456>`__ with the following
modifications:

* `standalone <https://lpirl.github.io/studioclock/>`__
  ~ no Chrome app anymore

  * thus, no settings storage

* implemented airspeak-like talking in addition to original
  chiming/beeping
* online synchronization enabled by default
* menu elements (bottom right and left) hidden by default
  (mouseover to see)
* added possibility to upload a custom logo image
* double-click/double-tap to enter/leave fullscreen
  (especially for mobile)
* better hackability

  * via `index.html <index.html>`__
  * via ``styles/local.css``
    (check `styles/clock.css <styles/clock.css>`__ to get started)
  * via ``scripts/local.js``
    (check `scripts/base.js <scripts/base.js>`__ to get started)

* improvements under the hood

  * more lightweight scheduling of sounds
  * fixes for custom colors

dev notes
---------

Audio generated using `"texttowave" script
<https://gitlab.com/-/snippets/2581610>`__ and language model
``tts_models/en/jenny/jenny``.

To test all language models::

  NUMS="zero one too tree four fife six seven ait nine"

  for m in $(python3 ./texttowav -m list - | grep /en/); do \
  echo $NUMS | sed 's/ /. /g' | python3 texttowav -m $m - \
  $(echo $m | rev | cut -d/ -f1 | rev).wav; \
  done

To generate all sound files::

  for x in $(echo $NUMS); do \
  echo $x. | python3 texttowav -m tts_models/en/ljspeech/tacotron2-DCA - $x.wav; \
  done

Then truncate silence and convert to ogg.
