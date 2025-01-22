
using Microsoft.JSInterop;

namespace FinWeb;

public class IndexedDbAccessor(IJSRuntime jsRuntime)
    : IAsyncDisposable
{
    private Lazy<IJSObjectReference> _accessorJsRef = new();

    public async Task InitializeAsync()
    {
        await WaitForReference();
        await _accessorJsRef.Value.InvokeVoidAsync("initialize");
    }

    public async Task<T> GetValueAsync<T>(string store, int id)
    {
        await WaitForReference();
        return await _accessorJsRef.Value.InvokeAsync<T>("get", store, id);
    }

    public async Task SetValueAsync<T>(string store, T val)
    {
        await WaitForReference();

        await _accessorJsRef.Value.InvokeVoidAsync("set", store, val);
    }

    private async Task WaitForReference()
    {
        if (_accessorJsRef.IsValueCreated is false)
        {
            _accessorJsRef = new(await jsRuntime.InvokeAsync<IJSObjectReference>("import", "/js/IndexedDbAccessor.js"));
        }
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);
        if (_accessorJsRef.IsValueCreated)
        {
            await _accessorJsRef.Value.DisposeAsync();
        }
    }
}
