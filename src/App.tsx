
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nom complet</label>
                    <input
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                      placeholder="Nom complet"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Pays</label>
                    <select
                      value={authForm.country}
                      onChange={(e) => setAuthForm({ ...authForm, country: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    >
                      <option value="">Sélectionnez votre pays</option>
                      {appSettings.allowedCountries.map((country) => (
                        <option key={country} value={country}>
                          {countryLabels[country]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Numéro de téléphone</label>
                    <input
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      placeholder="Numéro de téléphone"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
                    <input
                      type="password"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      placeholder="Mot de passe"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Code de parrainage</label>
                    <input
                      value={authForm.sponsor}
                      onChange={(e) => setAuthForm({ ...authForm, sponsor: e.target.value })}
                      placeholder="Code parrain (facultatif)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-brand-blue px-4 py-3 font-bold text-white">
                    S’inscrire
                  </button>
                </div>
