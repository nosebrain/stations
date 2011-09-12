function savePref(key, value) {
  savePref(key, value, false);
}

function savePref(key, value, system) {
  if (!system) {
    key = createInstancePreferenceKey(key);
  }
  
  widget.setPreferenceForKey(value, key);
}

function getPref(key) {
  return this.getPref(key, false);
}

function getPref(key, system) {
  if (!system) {
    key = createInstancePreferenceKey(key);
  }
  
  return widget.preferenceForKey(key);
}